package com.shayamsharmaclasses.classcast;

import android.app.Notification;
import android.app.PendingIntent;
import android.content.Context;
import android.content.res.Resources;

import androidx.annotation.DrawableRes;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.StringRes;
import androidx.core.app.NotificationCompat;

import com.google.android.exoplayer2.C;
import com.google.android.exoplayer2.offline.Download;

import java.util.List;

public class CCDownloadNotificationHelper {
	private static final @StringRes int NULL_STRING_ID = 0;

	private final Context context;
	private final NotificationCompat.Builder notificationBuilder;
	private final String DOWNLOAD_GROUP_KEY = "com.shayamsharmaclasses.classcast.app.DOWNLOADS";

	public CCDownloadNotificationHelper(Context context, String channelId){
		this.context = context;
		this.notificationBuilder = new NotificationCompat.Builder(context, channelId);
	}

	public Notification buildProgressNotification(
		@DrawableRes int smallIcon,
		@Nullable PendingIntent contentIntent,
		@Nullable String msg,
		List<Download> downloads
		){
		AverageProgressStat progressStat = getAverageProgressStat(downloads);
		String titleString;
		Resources res = context.getResources();
		if(progressStat.haveDownloadTasks){
			titleString = res.getString(R.string.downloading_string) + " "
					+ progressStat.downloadTaskCount + " "
					+ (progressStat.downloadTaskCount ==1 ? res.getString(R.string.lecture_string):
					res.getString(R.string.lectures_string));
		}else if(progressStat.haveRemoveTasks){
			titleString = res.getString(R.string.exo_download_removing);
		}else{
			titleString = "";
		}
		return buildNotification(
			smallIcon,
			contentIntent,
			msg,
			titleString,
			100,
			progressStat.progress,
			progressStat.indeterminate,
			true,
			true
		);
	}

	private AverageProgressStat getAverageProgressStat(List<Download> downloads){
		AverageProgressStat progressStat = new AverageProgressStat();
		for (int i = 0; i < downloads.size(); i++) {
			Download download = downloads.get(i);
			if (download.state == Download.STATE_REMOVING) {
				progressStat.haveRemoveTasks = true;
				continue;
			}
			if (download.state != Download.STATE_RESTARTING
					&& download.state != Download.STATE_DOWNLOADING) {
				continue;
			}
			progressStat.haveDownloadTasks = true;
			float downloadPercentage = download.getPercentDownloaded();
			if (downloadPercentage != C.PERCENTAGE_UNSET) {
				progressStat.allDownloadPercentagesUnknown = false;
				progressStat.totalPercentage += downloadPercentage;
			}
			progressStat.haveDownloadedBytes |= download.getBytesDownloaded() > 0;
			progressStat.downloadTaskCount++;
		}

		if (progressStat.haveDownloadTasks) {
			progressStat.progress = (int) (progressStat.totalPercentage / progressStat.downloadTaskCount);
			progressStat.indeterminate = progressStat.allDownloadPercentagesUnknown && progressStat.haveDownloadedBytes;
		}
		return progressStat;
	}

	/**
	 * Returns a notification for a completed download.
	 *
	 * @param smallIcon A small icon for the notifications.
	 * @param contentIntent An optional content intent to send when the notification is clicked.
	 * @param message An optional message to display on the notification.
	 * @return The notification.
	 */
	public Notification buildDownloadCompletedNotification(
			@DrawableRes int smallIcon, @Nullable PendingIntent contentIntent, @Nullable String message) {
		String titleString = context.getResources().getString(R.string.exo_download_completed);
		return buildEndStateNotification(smallIcon, contentIntent, message, titleString);
	}

	/**
	 * Returns a notification for a failed download.
	 *
	 * @param smallIcon A small icon for the notifications.
	 * @param contentIntent An optional content intent to send when the notification is clicked.
	 * @param message An optional message to display on the notification.
	 * @return The notification.
	 */
	public Notification buildDownloadFailedNotification(
			@DrawableRes int smallIcon, @Nullable PendingIntent contentIntent, @Nullable String message) {
		String titleString = context.getResources().getString(R.string.exo_download_failed);
		return buildEndStateNotification(smallIcon, contentIntent, message, titleString);
	}

	private Notification buildEndStateNotification(
			@DrawableRes int smallIcon,
			@Nullable PendingIntent contentIntent,
			@Nullable String message,
			@NonNull String titleString) {
		return buildNotification(
				smallIcon,
				contentIntent,
				message,
				titleString,
				/* maxProgress= */ 0,
				/* currentProgress= */ 0,
				/* indeterminateProgress= */ false,
				/* ongoing= */ false,
				/* showWhen= */ true);
	}

	private Notification buildNotification(
			@DrawableRes int smallIcon,
			@Nullable PendingIntent contentIntent,
			@Nullable String message,
			@NonNull String titleString,
			int maxProgress,
			int currentProgress,
			boolean indeterminateProgress,
			boolean ongoing,
			boolean showWhen) {
		notificationBuilder.setSmallIcon(smallIcon);
		notificationBuilder.setContentTitle(titleString);
		notificationBuilder.setContentIntent(contentIntent);
//		notificationBuilder.setStyle(
//				message == null ? null : new NotificationCompat.BigTextStyle().bigText(message));
		notificationBuilder.setContentText(message);
		notificationBuilder.setProgress(maxProgress, currentProgress, indeterminateProgress);
		notificationBuilder.setOngoing(ongoing);
		notificationBuilder.setShowWhen(showWhen);
		return notificationBuilder.build();
	}

	private class AverageProgressStat{
		int progress = 0;
		boolean indeterminate = true;
		float totalPercentage = 0;
		int downloadTaskCount = 0;
		boolean allDownloadPercentagesUnknown = true;
		boolean haveDownloadedBytes = false;
		boolean haveDownloadTasks = false;
		boolean haveRemoveTasks = false;
	}
}
