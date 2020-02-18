package com.shayamsharmaclasses.classcast;

import android.app.Dialog;
import android.content.DialogInterface;
import android.os.Bundle;

import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.DialogFragment;

import com.google.android.exoplayer2.Format;
import com.google.android.exoplayer2.trackselection.DefaultTrackSelector;

public final class SettingsDialog extends DialogFragment implements DialogInterface.OnClickListener {
	private static final int NUM_OPT = 2;
	private static final int QUALITY_POS = 0;
	private static final int PLAYBACK_SPEED_POS = 1;
	private DefaultTrackSelector trackSelector;
	private DialogInterface.OnDismissListener onDismissListener;
	private boolean isShowingNextDialog;
	private int playBackSpeed;
	private Format currentFormat;

	SettingsDialog(DefaultTrackSelector trackSelector,
				   DialogInterface.OnDismissListener onDismissListener,
				   int currentPlaybackSpeed,
				   Format currentFormat){
		this.trackSelector = trackSelector;
		this.onDismissListener = onDismissListener;
		this.playBackSpeed = currentPlaybackSpeed;
		this.currentFormat = currentFormat;
	}

	@Override
	public Dialog onCreateDialog(Bundle savedInstanceState){
		String[] optionsList = new String[NUM_OPT];
		TrackSelectionDialog.TrackNames trackNames = new TrackSelectionDialog.TrackNames();
		optionsList[QUALITY_POS] = getResources()
				.getStringArray(R.array.settings_options)[QUALITY_POS] + " ("+
				trackNames.getTrackName(currentFormat) + ")";
		optionsList[PLAYBACK_SPEED_POS] = getResources()
				.getStringArray(R.array.settings_options)[PLAYBACK_SPEED_POS] + " ("+
				PlayBackSpeedDialog.getSpeedString(playBackSpeed) + ")";

		AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
		builder.setTitle(R.string.settings_dialog_title)
				.setIcon(R.drawable.settings_work_tool)
				.setItems(optionsList, this);
		isShowingNextDialog = false;
		return builder.create();
	}

	@Override
	public void onClick(DialogInterface dialog, int which) {
		isShowingNextDialog = true;
		switch (which){
			case QUALITY_POS:
				TrackSelectionDialog trackSelectionDialog =
						TrackSelectionDialog.createForTrackSelector(
								trackSelector,
								/* onDismissListener= */ onDismissListener);
				trackSelectionDialog.show(getActivity().getSupportFragmentManager(), /* tag= */ "TrackSelectionDialog");
				break;
			case PLAYBACK_SPEED_POS:
				PlayBackSpeedDialog playBackSpeedDialog = new PlayBackSpeedDialog(onDismissListener, playBackSpeed);
				playBackSpeedDialog.show(getActivity().getSupportFragmentManager(), "PlaybackSpeedDialog");
				break;
		}
	}

	@Override
	public void onDismiss(DialogInterface dialog){
		super.onDismiss(dialog);
		if(!isShowingNextDialog) onDismissListener.onDismiss(dialog);
	}
}
