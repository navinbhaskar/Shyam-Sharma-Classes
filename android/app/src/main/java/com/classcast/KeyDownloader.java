package com.shayamsharmaclasses.classcast;

import android.content.Context;
import android.os.AsyncTask;
import android.util.Base64;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;
import org.xmlpull.v1.XmlPullParserFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class KeyDownloader implements Callback, StoreKeysTask.onKeyStoredCallback{
    private static final String TAG = "KeyDownloader";
    private Context context;
    private String mpdUrl;
    private String licenseUrl;
    private File tempDirectory;
    private String name;
    private String singleKid = null;
    private KeyDownloaderCallback callback;
    public boolean isMpdDownloaded = false;

    private static MediaType JSON = MediaType.parse("application/json");

    @Override
    public void onKeysStored(boolean isSuccess, String key_response) {
        if(isSuccess){
            callback.onKeyDownloadSuccess(key_response);
        }else{
            callback.onKeyDownloadFail(new IOException("Could not store keys for the media"));
        }
        clean();
    }

    private void clean() {
        File mpd_file = new File(getTempDirectory(), getFileNameFromUrl(mpdUrl)+".mpd");
        if(mpd_file.exists()){
            mpd_file.delete();
        }
    }

    public interface KeyDownloaderCallback{
        void onMpdDownloadFail(Exception e);
        void onMpdDownloadSuccess();
        void onKeyDownloadFail(Exception e);
        void onKeyDownloadSuccess(String key);
    }

    public String getLicenseUrl() {
        return licenseUrl;
    }

    public String getName() {
        return name;
    }

    public String getMpdUrl(){
        return mpdUrl;
    }

    public KeyDownloader(Context cont, String name, String mpd_source, String license_source, KeyDownloaderCallback callback){
        context = cont;
        mpdUrl = mpd_source;
        licenseUrl = license_source;
        tempDirectory = null;
        this.callback = callback;
        this.name = name;
    }

    public void downloadMPDFile(){
        if(!isMpdDownloaded) {
            OkHttpClient client = new OkHttpClient();
            Request request = new Request.Builder().url(mpdUrl).build();
            client.newCall(request).enqueue(this);
        }
    }

    public void downloadAndStoreKeys(){
        if(!isMpdDownloaded){
            return;
        }
        try {
            parseKeys();
            OkHttpClient client = new OkHttpClient();
            String requestData = "{\"kids\":[\""+singleKid+"\"], \"type\":\"temporary\"}";
            RequestBody body = RequestBody.create(JSON, requestData);
            Request request = new Request.Builder().url(licenseUrl).post(body).build();
            client.newCall(request).enqueue(this);
        } catch (XmlPullParserException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void parseKeys() throws XmlPullParserException, IOException {
        File mpd_file = new File(getTempDirectory(), getFileNameFromUrl(mpdUrl)+".mpd");
        if(mpd_file.exists()){
            Log.e(TAG,"File exists");
        }else{
            Log.e(TAG, "File don't exist " + mpd_file.getAbsolutePath());
        }
        InputStream in = new FileInputStream(mpd_file);
        Log.e(TAG, "input stream ready");
        XmlPullParserFactory xmlFactoryObject = XmlPullParserFactory.newInstance();
        XmlPullParser parser = xmlFactoryObject.newPullParser();
        parser.setInput(in, "utf-8");
        parser.nextTag();
        while (parser.next() != XmlPullParser.END_TAG) {
            if (parser.getEventType() != XmlPullParser.START_TAG) {
                continue;
            }
            String name = parser.getName();
            if(name.equals("ContentProtection")){
                Log.e(TAG, "inside content protection");
                singleKid = parser.getAttributeValue(null, "cenc:default_KID");
                break;
            }
        }
        if(singleKid == null){
            callback.onMpdDownloadFail(new IOException("Failed to parse mpd"));
            return;
        }else{
            singleKid = singleKid.replace("-", "");
            singleKid = Base64.encodeToString(hexStringToByteArray(singleKid), Base64.NO_PADDING| Base64.URL_SAFE);
            singleKid = singleKid.substring(0,22);
            Log.e(TAG, singleKid);
        }
    }

    public static byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                    + Character.digit(s.charAt(i+1), 16));
        }
        return data;
    }

    private void storeKeys(String keysJson) {
        StoreKeysTask task = new StoreKeysTask(context, this);
        task.execute(keysJson, mpdUrl);
    }

    private String getFileNameFromUrl(String url){
        String full_name = url.substring(url.lastIndexOf('/') + 1);
        return full_name.substring(0,full_name.lastIndexOf("."));
    }

    private File getTempDirectory() {
        if (tempDirectory == null) {
            tempDirectory = context.getExternalFilesDir(null);
            if (tempDirectory == null) {
                tempDirectory = context.getFilesDir();
            }
            tempDirectory = new File(tempDirectory,"temp");
            if(!tempDirectory.exists()){
                tempDirectory.mkdir();
            }
        }
        return tempDirectory;
    }


    @Override
    public void onFailure(Call call, IOException e) {
        if(call.request().url().toString().equals(mpdUrl)) {
            callback.onMpdDownloadFail(e);
        }else if(call.request().url().toString().equals(licenseUrl)){
            callback.onKeyDownloadFail(e);
        }
    }

    @Override
    public void onResponse(Call call, Response response) throws IOException {
        if(call.request().url().toString().equals(mpdUrl)) {
            if (!response.isSuccessful()) {
                callback.onMpdDownloadFail(new IOException("Failed to download the media description file"));
                return;
            }
            File output = new File(getTempDirectory(), getFileNameFromUrl(mpdUrl) + ".mpd");
            if(output.exists()){
                if(!output.delete()){
                    callback.onMpdDownloadFail(new IOException("Could not delete the previous media description file"));
                    return;
                }
            }
            if (!output.createNewFile()) {
                callback.onMpdDownloadFail(new IOException("Could not create the media description file"));
                return;
            }
            FileOutputStream fos = new FileOutputStream(output);
            fos.write(response.body().bytes());
            fos.close();
            isMpdDownloaded = true;
            callback.onMpdDownloadSuccess();
        }else if(call.request().url().toString().equals(licenseUrl)){
            if (!response.isSuccessful()) {
                callback.onKeyDownloadFail(new IOException("Failed to fetch the media keys"));
                return;
            }
            storeKeys(response.body().string());
        }
    }
}

class StoreKeysTask extends AsyncTask<String, Void, String> {
    private Context context;
    private onKeyStoredCallback callback;
    public interface  onKeyStoredCallback{
        void onKeysStored(boolean isSuccess, String key_response);
    }

    StoreKeysTask(Context context, onKeyStoredCallback callback){
        this.context = context;
        this.callback = callback;
    }

    @Override
    protected String doInBackground(String... strings) {
        try {
            String data = strings[0];
            JSONObject jsonData = new JSONObject(data);
            String content_id = jsonData.getString("content_id");
            String content_name = jsonData.getString("name");
            String content_url = strings[1];
            JSONArray keys = jsonData.getJSONArray("keys");
            JSONObject keys2 = new JSONObject("{\"type\":\""+jsonData.getString("type")+"\"}");
            keys2.put("keys", keys);
            String key_set = keys2.toString();
            Log.e("StoreKeyTask", key_set);
            ContentKeysDatabaseContract.KeyDbHelper dbHelper =
                    new ContentKeysDatabaseContract.KeyDbHelper(context);
            if(dbHelper.insertKeys(content_name, content_id, key_set, content_url)){
                dbHelper.close();
                return key_set;
            }else{
                dbHelper.close();
                return null;
            }
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    protected void onPostExecute(String key_set){
        if(key_set == null){
            callback.onKeysStored(false, null);
        }else{
            callback.onKeysStored(true, key_set);
        }
    }
}
