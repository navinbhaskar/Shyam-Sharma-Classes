package com.shayamsharmaclasses.classcast;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;

import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.DialogFragment;

public class PlayBackSpeedDialog extends DialogFragment implements DialogInterface.OnClickListener{
	public static final int POS_0_25 = 0;
	public static final int POS_0_50 = 1;
	public static final int POS_0_75 = 2;
	public static final int POS_NORMAL = 3;
	public static final int POS_1_25 = 4;
	public static final int POS_1_50 = 5;
	public static final int POS_1_75 = 6;
	public static final int POS_2_00 = 7;

	private DialogInterface.OnDismissListener onDismissListener;
	private PlaybackSpeedListener listener;
	private int playbackSpeedChecked;


	public interface PlaybackSpeedListener{
		void onOkClick(int selection);
	}

	PlayBackSpeedDialog(DialogInterface.OnDismissListener onDismissListener, int checked){
		this.onDismissListener = onDismissListener;
		playbackSpeedChecked = checked;
	}

	public static double getSpeedFromPos(int pos){
		switch (pos){
			case POS_0_25: return 0.25;
			case POS_0_50: return 0.50;
			case POS_0_75: return 0.75;
			case POS_NORMAL: return  1.0;
			case POS_1_25: return 1.25;
			case POS_1_50: return 1.50;
			case POS_1_75: return 1.75;
			case POS_2_00: return 2.0;
			default: return 1.0;
		}
	}

	public static int getPosFromSpeed(float speed){
		if(speed == 0.25) {
			return POS_0_25;
		}else if(speed == 0.50) {
			return POS_0_50;
		}else if(speed == 0.75) {
			return POS_0_75;
		}else if(speed == 1.0) {
			return POS_NORMAL;
		}else if(speed == 1.25) {
			return POS_1_25;
		}else if(speed == 1.50) {
			return POS_1_50;
		}else if(speed == 1.75) {
			return POS_1_75;
		}else if(speed == 2.0) {
			return POS_2_00;
		}else {
			return POS_NORMAL;
		}
	}

	public static String getSpeedString(int pos){
		double speed = getSpeedFromPos(pos);
		if(speed == 1.0){
			return "Normal";
		}else{
			return ""+speed;
		}
	}

	@Override
	public Dialog onCreateDialog(Bundle savedInstanceState){
		AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
		builder.setTitle(R.string.playback_speed)
				.setSingleChoiceItems(R.array.playback_speed_options, playbackSpeedChecked, this)
				.setPositiveButton(R.string.ok, this)
				.setNegativeButton(R.string.cancel, this);
		return builder.create();
	}

	@Override
	public void onClick(DialogInterface dialog, int which) {
		switch (which){
			case DialogInterface.BUTTON_POSITIVE:
				listener.onOkClick(playbackSpeedChecked);
				break;
			case DialogInterface.BUTTON_NEGATIVE:
				dialog.dismiss();
				break;
			case POS_0_25: playbackSpeedChecked = POS_0_25; break;
			case POS_0_50: playbackSpeedChecked = POS_0_50; break;
			case POS_0_75: playbackSpeedChecked = POS_0_75; break;
			case POS_NORMAL: playbackSpeedChecked = POS_NORMAL; break;
			case POS_1_25: playbackSpeedChecked = POS_1_25; break;
			case POS_1_50: playbackSpeedChecked = POS_1_50; break;
			case POS_1_75: playbackSpeedChecked = POS_1_75; break;
			case POS_2_00: playbackSpeedChecked = POS_2_00; break;
		}
	}

	@Override
	public void onDismiss(DialogInterface dialog){
		super.onDismiss(dialog);
		onDismissListener.onDismiss(dialog);
	}

	@Override
	public void onAttach(Context context) {
		super.onAttach(context);
		// Verify that the host activity implements the callback interface
		try {
			// Instantiate the NoticeDialogListener so we can send events to the host
			listener = (PlaybackSpeedListener) context;
		} catch (ClassCastException e) {
			// The activity doesn't implement the interface, throw exception
			throw new ClassCastException(context.toString()
					+ " must implement NoticeDialogListener");
		}
	}
}
