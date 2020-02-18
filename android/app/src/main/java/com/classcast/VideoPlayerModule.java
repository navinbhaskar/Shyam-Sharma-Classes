package com.shayamsharmaclasses.classcast;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.exoplayer2.C;
import com.google.android.exoplayer2.RenderersFactory;
import com.google.android.exoplayer2.drm.DefaultDrmSessionManager;
import com.google.android.exoplayer2.drm.FrameworkMediaCrypto;
import com.google.android.exoplayer2.drm.FrameworkMediaDrm;
import com.google.android.exoplayer2.drm.HttpMediaDrmCallback;
import com.google.android.exoplayer2.drm.UnsupportedDrmException;
import com.google.android.exoplayer2.offline.Download;
import com.google.android.exoplayer2.offline.DownloadCursor;
import com.google.android.exoplayer2.offline.DownloadIndex;
import com.google.android.exoplayer2.offline.DownloadManager;
import com.google.android.exoplayer2.offline.DownloadService;
import com.google.android.exoplayer2.upstream.HttpDataSource;
import com.google.android.exoplayer2.util.Util;

import java.io.IOException;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;

public class VideoPlayerModule extends ReactContextBaseJavaModule implements
		KeyDownloader.KeyDownloaderCallback,
		DownloadTracker.ProgressListener,
		GetOfflineKeys.OfflineKeysCallback {
	private static final String TAG = "VideoPlayerModule";
	private KeyDownloader keyDownloader;
	private FrameworkMediaDrm mediaDrm;
	private Handler handler;

	VideoPlayerModule(ReactApplicationContext reactContext) {
		super(reactContext);
		handler = new Handler(Looper.getMainLooper()){
			@Override
			public void handleMessage(Message msg){
				switch (msg.what){
					case 0:
						Toast.makeText(getReactApplicationContext(),
								((Exception) msg.obj).getMessage(), Toast.LENGTH_SHORT).show();
				}
			}
		};
	}

	@Override
	public String getName() {
		return "Player";
	}

	@ReactMethod
	public void playContent(String content_url, String license_url, boolean is_offline) {
		ReactApplicationContext context = getReactApplicationContext();

		if(is_offline){
			GetOfflineKeys task = new GetOfflineKeys(context, this);
			task.execute(content_url);
		}else {
			Intent intent = new Intent(context, PlayerActivity.class);
			intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			intent.setAction(PlayerActivity.ACTION_VIEW);

			intent.setData(Uri.parse(content_url));
			intent.putExtra(PlayerActivity.DRM_LICENSE_URL_EXTRA, license_url);
			intent.putExtra(PlayerActivity.DRM_SCHEME_EXTRA, "clearkey");
			intent.putExtra(PlayerActivity.EXTENSION_EXTRA, "mpd");

			context.startActivity(intent);
		}
	}

	@ReactMethod
	public void downloadContent(String content_name, String content_url, String license_url){
		keyDownloader = new KeyDownloader(getReactApplicationContext(), content_name, content_url, license_url, this);
		keyDownloader.downloadMPDFile();
	}

	@ReactMethod
	public void startSendingPogressEvent(){
		Timer timer = new Timer();
		timer.schedule(new ProgressEmitterTask(
						((MainApplication)getCurrentActivity().getApplication()).getDownloadManager(), timer),
				1000,1000);
	}

	@ReactMethod
	public void getDownloadsData(Callback errorCallback, Callback successCallback){
		DownloadManager downloadManager = ((MainApplication) getCurrentActivity().getApplication()).
				getDownloadManager();
		DownloadIndex index = downloadManager.getDownloadIndex();
		WritableArray downloadsData = Arguments.createArray();
		try {
			DownloadCursor downloads = index.getDownloads();
			downloads.moveToFirst();
			for(int i=0; i<downloads.getCount(); ++i){
				WritableMap downloadData = Arguments.createMap();
				Download download = downloads.getDownload();
				downloadData.putString("name", Util.fromUtf8Bytes(download.request.data));
				downloadData.putString("url", download.request.uri.toString());
				downloadData.putInt("state", download.state);
				downloadsData.pushMap(downloadData);
				downloads.moveToNext();
			}
			successCallback.invoke(downloadsData);
		} catch (IOException e) {
			e.printStackTrace();
			errorCallback.invoke(e.getMessage());
		}
	}

	@ReactMethod
	public void getCurrentDownloads(Callback successCallback){
		DownloadManager downloadManager = ((MainApplication) getCurrentActivity().getApplication())
				.getDownloadManager();
		List<Download> downloads = downloadManager.getCurrentDownloads();
		WritableArray downloadsData = Arguments.createArray();

		for(int i=0; i<downloads.size(); ++i){
			WritableMap downloadData = Arguments.createMap();
			Download download = downloads.get(i);
			downloadData.putString("name", Util.fromUtf8Bytes(download.request.data));
			downloadData.putString("url", download.request.uri.toString());
			downloadData.putInt("state", download.state);
			downloadsData.pushMap(downloadData);
		}

		successCallback.invoke(downloadsData);
	}

	@ReactMethod
	public void pauseDownload(String content_url){
		DownloadService.sendSetStopReason(
				getReactApplicationContext(),
				CCDownloadService.class,
				content_url,
				1000,
				true
		);
	}

	@ReactMethod
	public void resumeDownload(String content_url) {
		DownloadService.sendSetStopReason(
				getReactApplicationContext(),
				CCDownloadService.class,
				content_url,
				Download.STOP_REASON_NONE,
				true
		);
	}

	@ReactMethod
	public void removeDownload(String content_url){
		DownloadService.sendRemoveDownload(
				getReactApplicationContext(),
				CCDownloadService.class,
				content_url,
				true
		);
	}


	@Override
	public void onMpdDownloadFail(Exception e) {
		sendErrorToHandler(e);
	}

	@Override
	public void onMpdDownloadSuccess() {
		if(keyDownloader.isMpdDownloaded){
			keyDownloader.downloadAndStoreKeys();
		}
	}

	@Override
	public void onKeyDownloadFail(Exception e) {
		sendErrorToHandler(e);
	}

	@Override
	public void onKeyDownloadSuccess(String k) {
		startContentDownload();
	}

	@Override
	public void onDownloadStarted() {
		startSendingPogressEvent();
	}

	@Override
	public void onOfflineKeys(Bundle data) {
		ReactApplicationContext context = getReactApplicationContext();
		Intent intent = new Intent(context, PlayerActivity.class);
		intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		intent.setAction(PlayerActivity.ACTION_VIEW);

		intent.setData(Uri.parse(data.getString("content_url")));
		intent.putExtra(PlayerActivity.DRM_LICENSE_URL_EXTRA, "");
		intent.putExtra(PlayerActivity.IS_OFFLINE_EXTRA, true);
		intent.putExtra(PlayerActivity.KEY_RESPONSE_EXTRA, data.getString("key_set"));
		intent.putExtra(PlayerActivity.DRM_SCHEME_EXTRA, "clearkey");
		intent.putExtra(PlayerActivity.EXTENSION_EXTRA, "mpd");

		context.startActivity(intent);
	}

	@Override
	public void onOfflineKeysError(String msg) {
		sendErrorToHandler(new IOException(msg));
	}

	private void sendErrorToHandler(Exception e){
		Message msg = handler.obtainMessage(0,e);
		msg.sendToTarget();
	}

	private void startContentDownload(){
		try {
			MainApplication application = (MainApplication) getCurrentActivity().getApplication();
			DefaultDrmSessionManager<FrameworkMediaCrypto> drmSessionManager =
					buildDrmSessionManagerV18(C.CLEARKEY_UUID,
							keyDownloader.getLicenseUrl(),
							null,
							false);
			RenderersFactory renderersFactory =
					application.buildRenderersFactory(false);
			application.getDownloadTracker().startDownload(
					((AppCompatActivity)getCurrentActivity()).getSupportFragmentManager(),
					keyDownloader.getName(),
					Uri.parse(keyDownloader.getMpdUrl()),
					"mpd",
					renderersFactory,
					drmSessionManager
			);
			application.getDownloadTracker().addProgressListener(this);
		} catch (UnsupportedDrmException e) {
			e.printStackTrace();
		}
	}

	private void sendEvent(String eventName, @Nullable WritableMap data){
		getReactApplicationContext()
				.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
				.emit(eventName, data);
	}


	private void releaseMediaDrm() {
		if (mediaDrm != null) {
			mediaDrm.release();
			mediaDrm = null;
		}
	}

	private DefaultDrmSessionManager<FrameworkMediaCrypto> buildDrmSessionManagerV18(
			UUID uuid, String licenseUrl, String[] keyRequestPropertiesArray, boolean multiSession)
			throws UnsupportedDrmException {
		HttpDataSource.Factory licenseDataSourceFactory =
				((MainApplication) getCurrentActivity().getApplication()).buildHttpDataSourceFactory();
		HttpMediaDrmCallback drmCallback =
				new HttpMediaDrmCallback(licenseUrl, licenseDataSourceFactory);
		if (keyRequestPropertiesArray != null) {
			for (int i = 0; i < keyRequestPropertiesArray.length - 1; i += 2) {
				drmCallback.setKeyRequestProperty(keyRequestPropertiesArray[i],
						keyRequestPropertiesArray[i + 1]);
			}
		}
		releaseMediaDrm();
		mediaDrm = FrameworkMediaDrm.newInstance(uuid);
		return new DefaultDrmSessionManager<>(uuid, mediaDrm, drmCallback, null, multiSession);
	}

	class ProgressEmitterTask extends TimerTask{
		private DownloadManager downloadManager;
		private Timer timer;

		public ProgressEmitterTask(DownloadManager manager, Timer timer){
			downloadManager =  manager;
			this.timer = timer;
		}

		@Override
		public void run() {
			List<Download> downloads = downloadManager.getCurrentDownloads();
			if(downloads.size() == 0){
				Log.e(TAG, "No current downloads, cancelling emitter");
				timer.cancel();
			}
			WritableMap progress = Arguments.createMap();
			for(int i=0; i<downloads.size(); ++i){
				Download download = downloads.get(i);
				Log.e(TAG, "" + download.getPercentDownloaded() + " "+ Util.fromUtf8Bytes(download.request.data));
				progress.putDouble(download.request.uri.toString(),
						download.getPercentDownloaded());
			}
			sendEvent("downloads_progress", progress);
		}
	}
}
class GetOfflineKeys extends AsyncTask<String, Void, Bundle>{
	private Context context;
	private OfflineKeysCallback callback;
	private static final String TAG = "GetOfflineKeys";
	public interface  OfflineKeysCallback{
		void onOfflineKeys(Bundle result);
		void onOfflineKeysError(String msg);
	}

	GetOfflineKeys(Context context, OfflineKeysCallback callback){
		this.context = context;
		this.callback = callback;
	}

	@Override
	protected Bundle doInBackground(String... strings) {
		ContentKeysDatabaseContract.KeyDbHelper dbHelper =
				new ContentKeysDatabaseContract.KeyDbHelper(context);
		String key_set = dbHelper.getKeys(strings[0]);
		dbHelper.close();
		Log.e(TAG, "got keys " + key_set);
		Bundle result = new Bundle();
		result.putString("content_url", strings[0]);
		result.putString("key_set", null);
		return result;
	}

	@Override
	protected void onPostExecute(Bundle data){
		if(data.getString("key_set") == null){
			Log.e(TAG, "null keys");
			callback.onOfflineKeysError("Content keys not available offline");
		}else{
			callback.onOfflineKeys(data);
		}
	}
}

