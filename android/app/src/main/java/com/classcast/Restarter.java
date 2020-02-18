package com.shayamsharmaclasses.classcast;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.google.android.exoplayer2.offline.DownloadService;

public class Restarter extends BroadcastReceiver {
	@Override
	public void onReceive(Context context, Intent intent) {
		Log.e("Restarter", "restarting download service");
		try{
			DownloadService.start(context, CCDownloadService.class);
		}catch (IllegalStateException e){
			DownloadService.startForeground(context, CCDownloadService.class);
		}
	}
}
