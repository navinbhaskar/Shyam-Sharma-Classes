package com.shayamsharmaclasses.classcast;

import android.app.Application;

import android.widget.Toast;

import com.facebook.react.ReactApplication;
import com.github.yamill.orientation.OrientationPackage;
import com.facebook.react.shell.MainReactPackage;
import com.google.android.exoplayer2.DefaultRenderersFactory;
import com.google.android.exoplayer2.RenderersFactory;
import com.google.android.exoplayer2.database.DatabaseProvider;
import com.google.android.exoplayer2.database.ExoDatabaseProvider;
import com.google.android.exoplayer2.offline.ActionFileUpgradeUtil;
import com.google.android.exoplayer2.offline.DefaultDownloadIndex;
import com.google.android.exoplayer2.offline.DefaultDownloaderFactory;
import com.google.android.exoplayer2.offline.DownloadManager;
import com.google.android.exoplayer2.offline.DownloadService;
import com.google.android.exoplayer2.offline.DownloaderConstructorHelper;
import com.google.android.exoplayer2.upstream.DataSource;
import com.google.android.exoplayer2.upstream.DefaultDataSourceFactory;
import com.google.android.exoplayer2.upstream.DefaultHttpDataSourceFactory;
import com.google.android.exoplayer2.upstream.FileDataSourceFactory;
import com.google.android.exoplayer2.upstream.HttpDataSource;
import com.google.android.exoplayer2.upstream.cache.Cache;
import com.google.android.exoplayer2.upstream.cache.CacheDataSource;
import com.google.android.exoplayer2.upstream.cache.CacheDataSourceFactory;
import com.google.android.exoplayer2.upstream.cache.NoOpCacheEvictor;
import com.google.android.exoplayer2.upstream.cache.SimpleCache;
import com.google.android.exoplayer2.util.Log;
import com.google.android.exoplayer2.util.Util;


import java.io.File;
import java.io.IOException;
import java.util.Arrays;


import com.facebook.react.PackageList;
import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import io.invertase.firebase.links.RNFirebaseLinksPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static final String TAG = "MainApplication";
  private static final String DOWNLOAD_ACTION_FILE = "actions";
  private static final String DOWNLOAD_TRACKER_ACTION_FILE = "tracked_actions";
  private static final String DOWNLOAD_CONTENT_DIRECTORY = "downloads";

  protected String userAgent;

  private DatabaseProvider databaseProvider;
  private File downloadDirectory;
  private Cache downloadCache;
  private DownloadManager downloadManager;
  private DownloadTracker downloadTracker;


  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      packages.add(new RNFirebaseAuthPackage());
      packages.add(new RNFirebaseFirestorePackage());
      packages.add(new RNFirebaseMessagingPackage());
      packages.add(new RNFirebaseStoragePackage());
      packages.add(new RNFirebaseLinksPackage());
      packages.add(new RNFirebaseAnalyticsPackage());
      packages.add(new RNFirebaseNotificationsPackage());
      // Packages that cannot be autolinked yet can be added manually here, for example:
      // packages.add(new MyReactNativePackage());
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    userAgent = Util.getUserAgent(this, "shayamsharmaclasses.classcast");
    Log.e("MainApplication", "starting download service");
    try{
      DownloadService.start(this, CCDownloadService.class);
    }catch (IllegalStateException e){
      try {
        DownloadService.startForeground(this, CCDownloadService.class);
      }catch (Exception e2){
        Toast.makeText(getApplicationContext(), "Failed to start download service",
            Toast.LENGTH_SHORT).show();
      }
    }catch(Exception e){
      Toast.makeText(getApplicationContext(), "Failed to start download service",
          Toast.LENGTH_SHORT).show();
    }
  }

  /** Returns a {@link DataSource.Factory}. */
  public DataSource.Factory buildDataSourceFactory() {
    DefaultDataSourceFactory upstreamFactory =
        new DefaultDataSourceFactory(this, buildHttpDataSourceFactory());
    return buildReadOnlyCacheDataSource(upstreamFactory, getDownloadCache());
  }

  /** Returns a {@link HttpDataSource.Factory}. */
  public HttpDataSource.Factory buildHttpDataSourceFactory() {
    return new DefaultHttpDataSourceFactory(userAgent);
  }

  /** Returns whether extension renderers should be used. */
  public boolean useExtensionRenderers() {
    return "withExtensions".equals(BuildConfig.FLAVOR);
  }

  public RenderersFactory buildRenderersFactory(boolean preferExtensionRenderer) {
    @DefaultRenderersFactory.ExtensionRendererMode
    int extensionRendererMode =
        useExtensionRenderers()
            ? (preferExtensionRenderer
            ? DefaultRenderersFactory.EXTENSION_RENDERER_MODE_PREFER
            : DefaultRenderersFactory.EXTENSION_RENDERER_MODE_ON)
            : DefaultRenderersFactory.EXTENSION_RENDERER_MODE_OFF;
    return new DefaultRenderersFactory(/* context= */ this)
        .setExtensionRendererMode(extensionRendererMode);
  }

  public DownloadManager getDownloadManager() {
    initDownloadManager();
    return downloadManager;
  }

  public DownloadTracker getDownloadTracker() {
    initDownloadManager();
    return downloadTracker;
  }

  protected synchronized Cache getDownloadCache() {
    if (downloadCache == null) {
      File downloadContentDirectory = new File(getDownloadDirectory(), DOWNLOAD_CONTENT_DIRECTORY);
      downloadCache =
          new SimpleCache(downloadContentDirectory, new NoOpCacheEvictor(), getDatabaseProvider());
    }
    return downloadCache;
  }

  private synchronized void initDownloadManager() {
    if (downloadManager == null) {
      DefaultDownloadIndex downloadIndex = new DefaultDownloadIndex(getDatabaseProvider());
      upgradeActionFile(
          DOWNLOAD_ACTION_FILE, downloadIndex, /* addNewDownloadsAsCompleted= */ false);
      upgradeActionFile(
          DOWNLOAD_TRACKER_ACTION_FILE, downloadIndex, /* addNewDownloadsAsCompleted= */ true);
      DownloaderConstructorHelper downloaderConstructorHelper =
          new DownloaderConstructorHelper(getDownloadCache(), buildHttpDataSourceFactory());
      downloadManager =
          new DownloadManager(
              this, downloadIndex, new DefaultDownloaderFactory(downloaderConstructorHelper));
      downloadTracker =
          new DownloadTracker(/* context= */ this, buildDataSourceFactory(), downloadManager);
    }
  }

  private void upgradeActionFile(
      String fileName, DefaultDownloadIndex downloadIndex, boolean addNewDownloadsAsCompleted) {
    try {
      ActionFileUpgradeUtil.upgradeAndDelete(
          new File(getDownloadDirectory(), fileName),
          /* downloadIdProvider= */ null,
          downloadIndex,
          /* deleteOnFailure= */ true,
          addNewDownloadsAsCompleted);
    } catch (IOException e) {
      Log.e(TAG, "Failed to upgrade action file: " + fileName, e);
    }
  }

  private DatabaseProvider getDatabaseProvider() {
    if (databaseProvider == null) {
      databaseProvider = new ExoDatabaseProvider(this);
    }
    return databaseProvider;
  }

  private File getDownloadDirectory() {
    if (downloadDirectory == null) {
      downloadDirectory = getExternalFilesDir(null);
      if (downloadDirectory == null) {
        downloadDirectory = getFilesDir();
      }
    }
    return downloadDirectory;
  }

  protected static CacheDataSourceFactory buildReadOnlyCacheDataSource(
      DataSource.Factory upstreamFactory, Cache cache) {
    return new CacheDataSourceFactory(
        cache,
        upstreamFactory,
        new FileDataSourceFactory(),
        /* cacheWriteDataSinkFactory= */ null,
        CacheDataSource.FLAG_IGNORE_CACHE_ON_ERROR,
        /* eventListener= */ null);
  }

}
