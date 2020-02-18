/*
 * Copyright (C) 2016 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.shayamsharmaclasses.classcast;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.util.Pair;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ImageButton;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.dynamicanimation.animation.DynamicAnimation;
import androidx.dynamicanimation.animation.SpringAnimation;
import androidx.fragment.app.DialogFragment;

import com.google.android.exoplayer2.C;
import com.google.android.exoplayer2.C.ContentType;
import com.google.android.exoplayer2.ExoPlaybackException;
import com.google.android.exoplayer2.ExoPlayerFactory;
import com.google.android.exoplayer2.PlaybackParameters;
import com.google.android.exoplayer2.PlaybackPreparer;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.RenderersFactory;
import com.google.android.exoplayer2.SimpleExoPlayer;
import com.google.android.exoplayer2.drm.DefaultDrmSessionManager;
import com.google.android.exoplayer2.drm.FrameworkMediaCrypto;
import com.google.android.exoplayer2.drm.FrameworkMediaDrm;
import com.google.android.exoplayer2.drm.HttpMediaDrmCallback;
import com.google.android.exoplayer2.drm.LocalMediaDrmCallback;
import com.google.android.exoplayer2.drm.UnsupportedDrmException;
import com.google.android.exoplayer2.mediacodec.MediaCodecRenderer.DecoderInitializationException;
import com.google.android.exoplayer2.mediacodec.MediaCodecUtil.DecoderQueryException;
import com.google.android.exoplayer2.offline.DownloadHelper;
import com.google.android.exoplayer2.offline.DownloadRequest;
import com.google.android.exoplayer2.source.BehindLiveWindowException;
import com.google.android.exoplayer2.source.ConcatenatingMediaSource;
import com.google.android.exoplayer2.source.MediaSource;
import com.google.android.exoplayer2.source.ProgressiveMediaSource;
import com.google.android.exoplayer2.source.TrackGroupArray;
import com.google.android.exoplayer2.source.ads.AdsLoader;
import com.google.android.exoplayer2.source.ads.AdsMediaSource;
import com.google.android.exoplayer2.source.dash.DashMediaSource;
import com.google.android.exoplayer2.source.hls.HlsMediaSource;
import com.google.android.exoplayer2.source.smoothstreaming.SsMediaSource;
import com.google.android.exoplayer2.trackselection.AdaptiveTrackSelection;
import com.google.android.exoplayer2.trackselection.DefaultTrackSelector;
import com.google.android.exoplayer2.trackselection.MappingTrackSelector.MappedTrackInfo;
import com.google.android.exoplayer2.trackselection.RandomTrackSelection;
import com.google.android.exoplayer2.trackselection.TrackSelection;
import com.google.android.exoplayer2.trackselection.TrackSelectionArray;
import com.google.android.exoplayer2.ui.PlayerView;
import com.google.android.exoplayer2.ui.spherical.SphericalSurfaceView;
import com.google.android.exoplayer2.upstream.DataSource;
import com.google.android.exoplayer2.upstream.HttpDataSource;
import com.google.android.exoplayer2.util.ErrorMessageProvider;
import com.google.android.exoplayer2.util.EventLogger;
import com.google.android.exoplayer2.util.Util;

import java.lang.reflect.Constructor;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.util.UUID;

/** An activity that plays media using {@link SimpleExoPlayer}. */
public class PlayerActivity extends AppCompatActivity
        implements OnClickListener, PlaybackPreparer, PlayBackSpeedDialog.PlaybackSpeedListener {

    public static final String DRM_SCHEME_EXTRA = "drm_scheme";
    public static final String DRM_LICENSE_URL_EXTRA = "drm_license_url";
    public static final String DRM_KEY_REQUEST_PROPERTIES_EXTRA = "drm_key_request_properties";
    public static final String DRM_MULTI_SESSION_EXTRA = "drm_multi_session";
    public static final String PREFER_EXTENSION_DECODERS_EXTRA = "prefer_extension_decoders";

    public static final String ACTION_VIEW = "com.shayamsharmaclasses.classcast.action.VIEW";
    public static final String EXTENSION_EXTRA = "extension";

    public static final String ACTION_VIEW_LIST = "com.shayamsharmaclasses.classcast.action.VIEW_LIST";
    public static final String URI_LIST_EXTRA = "uri_list";
    public static final String EXTENSION_LIST_EXTRA = "extension_list";

    public static final String AD_TAG_URI_EXTRA = "ad_tag_uri";

    public static final String ABR_ALGORITHM_EXTRA = "abr_algorithm";
    public static final String ABR_ALGORITHM_DEFAULT = "default";
    public static final String ABR_ALGORITHM_RANDOM = "random";

    public static final String SPHERICAL_STEREO_MODE_EXTRA = "spherical_stereo_mode";
    public static final String SPHERICAL_STEREO_MODE_MONO = "mono";
    public static final String SPHERICAL_STEREO_MODE_TOP_BOTTOM = "top_bottom";
    public static final String SPHERICAL_STEREO_MODE_LEFT_RIGHT = "left_right";

    public static final String IS_OFFLINE_EXTRA = "is_offline";
    public static final String KEY_RESPONSE_EXTRA = "key_response";

    // For backwards compatibility only.
    private static final String DRM_SCHEME_UUID_EXTRA = "drm_scheme_uuid";

    // Saved instance state keys.
    private static final String KEY_TRACK_SELECTOR_PARAMETERS = "track_selector_parameters";
    private static final String KEY_WINDOW = "window";
    private static final String KEY_POSITION = "position";
    private static final String KEY_AUTO_PLAY = "auto_play";
    private static final String KEY_PLAYBACK_SPEED = "playback_speed";

    private static final CookieManager DEFAULT_COOKIE_MANAGER;
    static {
        DEFAULT_COOKIE_MANAGER = new CookieManager();
        DEFAULT_COOKIE_MANAGER.setCookiePolicy(CookiePolicy.ACCEPT_ORIGINAL_SERVER);
    }

    private PlayerView playerView;
    private ImageButton settingsButton;
    private ImageButton ffwdButton;
    private ImageButton rewButton;

    private SpringAnimation ffwdAnim1;
    private SpringAnimation ffwdAnim2;
	private SpringAnimation rewAnim1;
	private SpringAnimation rewAnim2;

    private boolean isShowingSettingsDialog;

    private DataSource.Factory dataSourceFactory;
    private SimpleExoPlayer player;
    private FrameworkMediaDrm mediaDrm;
    private MediaSource mediaSource;
    private DefaultTrackSelector trackSelector;
    private DefaultTrackSelector.Parameters trackSelectorParameters;
    private TrackGroupArray lastSeenTrackGroupArray;

    private boolean startAutoPlay;
    private int startWindow;
    private long startPosition;
    private int playbackSpeed;

    private boolean autoPlayBeforeOutOfFocus = true;
    // Fields used only for ad playback. The ads loader is loaded via reflection.

    private AdsLoader adsLoader;
    private Uri loadedAdTagUri;

    // Activity lifecycle

    @Override
    public void onCreate(Bundle savedInstanceState) {
        String sphericalStereoMode = getIntent().getStringExtra(SPHERICAL_STEREO_MODE_EXTRA);
        if (sphericalStereoMode != null) {
            setTheme(R.style.PlayerTheme_Spherical);
        }
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);

        super.onCreate(savedInstanceState);
        dataSourceFactory = buildDataSourceFactory();
        if (CookieHandler.getDefault() != DEFAULT_COOKIE_MANAGER) {
            CookieHandler.setDefault(DEFAULT_COOKIE_MANAGER);
        }

        setContentView(R.layout.player_activity);

        settingsButton = findViewById(R.id.settings_button);
        settingsButton.setOnClickListener(this);

        playerView = findViewById(R.id.player_view);
        playerView.setErrorMessageProvider(new PlayerErrorMessageProvider());
        playerView.requestFocus();
        playerView.setShowBuffering(PlayerView.SHOW_BUFFERING_WHEN_PLAYING);
        if (sphericalStereoMode != null) {
            int stereoMode;
            if (SPHERICAL_STEREO_MODE_MONO.equals(sphericalStereoMode)) {
                stereoMode = C.STEREO_MODE_MONO;
            } else if (SPHERICAL_STEREO_MODE_TOP_BOTTOM.equals(sphericalStereoMode)) {
                stereoMode = C.STEREO_MODE_TOP_BOTTOM;
            } else if (SPHERICAL_STEREO_MODE_LEFT_RIGHT.equals(sphericalStereoMode)) {
                stereoMode = C.STEREO_MODE_LEFT_RIGHT;
            } else {
                showToast(R.string.error_unrecognized_stereo_mode);
                finish();
                return;
            }
            ((SphericalSurfaceView) playerView.getVideoSurfaceView()).setDefaultStereoMode(stereoMode);
        }

        if (savedInstanceState != null) {
            trackSelectorParameters = savedInstanceState.getParcelable(KEY_TRACK_SELECTOR_PARAMETERS);
            startAutoPlay = savedInstanceState.getBoolean(KEY_AUTO_PLAY);
            startWindow = savedInstanceState.getInt(KEY_WINDOW);
            startPosition = savedInstanceState.getLong(KEY_POSITION);
            playbackSpeed = savedInstanceState.getInt(KEY_PLAYBACK_SPEED);
        } else {
            trackSelectorParameters = new DefaultTrackSelector.ParametersBuilder().build();
            clearStartPosition();
        }

        ffwdButton = findViewById(R.id.exo_ffwd);
        ffwdButton.setOnClickListener(this);
        ffwdAnim1 = new SpringAnimation(ffwdButton, DynamicAnimation.ROTATION, 60);
        ffwdAnim2 = new SpringAnimation(ffwdButton, DynamicAnimation.ROTATION, 0);

        ffwdAnim1.addEndListener((animation, canceled, value, velocity) -> {
           ffwdAnim2.start();
        });

		rewButton = findViewById(R.id.exo_rew);
		rewButton.setOnClickListener(this);
		rewAnim1 = new SpringAnimation(rewButton, DynamicAnimation.ROTATION, -60);
		rewAnim2 = new SpringAnimation(rewButton, DynamicAnimation.ROTATION, 0);

		rewAnim1.addEndListener((animation, canceled, value, velocity) -> {
			rewAnim2.start();
		});
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        releasePlayer();
        releaseAdsLoader();
        clearStartPosition();
        setIntent(intent);
    }

    @Override
    public void onStart() {
        super.onStart();
        if (Util.SDK_INT > 23) {
            initializePlayer();
            if (playerView != null) {
                playerView.onResume();
            }
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        if (Util.SDK_INT <= 23 || player == null) {
            initializePlayer();
            if (playerView != null) {
                playerView.onResume();
            }
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        if (Util.SDK_INT <= 23) {
            if (playerView != null) {
                playerView.onPause();
            }
            releasePlayer();
        }
    }

    @Override
    public void onStop() {
        super.onStop();
        if (Util.SDK_INT > 23) {
            if (playerView != null) {
                playerView.onPause();
            }
            releasePlayer();
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        releaseAdsLoader();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        if (grantResults.length == 0) {
            // Empty results are triggered if a permission is requested while another request was already
            // pending and can be safely ignored in this case.
            return;
        }
        if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            initializePlayer();
        } else {
            showToast(R.string.storage_permission_denied);
            finish();
        }
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        updateTrackSelectorParameters();
        updateStartPosition();
        outState.putParcelable(KEY_TRACK_SELECTOR_PARAMETERS, trackSelectorParameters);
        outState.putBoolean(KEY_AUTO_PLAY, startAutoPlay);
        outState.putInt(KEY_WINDOW, startWindow);
        outState.putLong(KEY_POSITION, startPosition);
        outState.putInt(KEY_PLAYBACK_SPEED, playbackSpeed);
    }

    // Activity input

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        // See whether the player view wants to handle media or DPAD keys events.
        return playerView.dispatchKeyEvent(event) || super.dispatchKeyEvent(event);
    }

    // OnClickListener methods

    @Override
    public void onClick(View view) {
        if (view == settingsButton
                && !isShowingSettingsDialog
                && TrackSelectionDialog.willHaveContent(trackSelector)) {
            isShowingSettingsDialog = true;
            autoPlayBeforeOutOfFocus = player.getPlayWhenReady();
            player.setPlayWhenReady(false);
            DialogFragment settingsDialog  = new SettingsDialog(
                    trackSelector,
                    dialog -> {
                        isShowingSettingsDialog = false;
                        player.setPlayWhenReady(autoPlayBeforeOutOfFocus);
                    },
                    playbackSpeed,
                    player.getVideoFormat()
            );
            settingsDialog.show(getSupportFragmentManager(), "settings_dialog");
        }else if(view == ffwdButton){
            ffwdAnim1.start();
            playerView.dispatchMediaKeyEvent(
                    new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_FAST_FORWARD)
			);

        }else if(view == rewButton){
        	rewAnim1.start();
        	playerView.dispatchMediaKeyEvent(
        			new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_REWIND)
			);
		}
    }


    @Override
    public void onWindowFocusChanged(boolean isFocus){
        if(player != null && !isShowingSettingsDialog) {
            if (!isFocus) {
                autoPlayBeforeOutOfFocus = player.getPlayWhenReady();
                player.setPlayWhenReady(false);
            } else {
                player.setPlayWhenReady(autoPlayBeforeOutOfFocus);
            }
        }
    }
    // PlaybackControlView.PlaybackPreparer implementation

    @Override
    public void preparePlayback() {
        player.retry();
    }

    @Override
    public void onOkClick(int selection) {
        playbackSpeed = selection;
        player.setPlaybackParameters(
                new PlaybackParameters((float)PlayBackSpeedDialog.getSpeedFromPos(selection))
        );
    }

    private void initializePlayer() {
        if (player == null) {
            Intent intent = getIntent();
            String action = intent.getAction();
            Uri[] uris;
            String[] extensions;
            if (ACTION_VIEW.equals(action)) {
                uris = new Uri[] {intent.getData()};
                extensions = new String[] {intent.getStringExtra(EXTENSION_EXTRA)};
            } else if (ACTION_VIEW_LIST.equals(action)) {
                String[] uriStrings = intent.getStringArrayExtra(URI_LIST_EXTRA);
                uris = new Uri[uriStrings.length];
                for (int i = 0; i < uriStrings.length; i++) {
                    uris[i] = Uri.parse(uriStrings[i]);
                }
                extensions = intent.getStringArrayExtra(EXTENSION_LIST_EXTRA);
                if (extensions == null) {
                    extensions = new String[uriStrings.length];
                }
            } else {
                showToast(getString(R.string.unexpected_intent_action, action));
                finish();
                return;
            }
            if (!Util.checkCleartextTrafficPermitted(uris)) {
                showToast(R.string.error_cleartext_not_permitted);
                return;
            }
            if (Util.maybeRequestReadExternalStoragePermission(/* activity= */ this, uris)) {
                // The player will be reinitialized if the permission is granted.
                return;
            }

            DefaultDrmSessionManager<FrameworkMediaCrypto> drmSessionManager = null;
            if (intent.hasExtra(DRM_SCHEME_EXTRA) || intent.hasExtra(DRM_SCHEME_UUID_EXTRA)) {
                String drmLicenseUrl = intent.getStringExtra(DRM_LICENSE_URL_EXTRA);
                String[] keyRequestPropertiesArray =
                        intent.getStringArrayExtra(DRM_KEY_REQUEST_PROPERTIES_EXTRA);
                boolean multiSession = intent.getBooleanExtra(DRM_MULTI_SESSION_EXTRA, false);
                int errorStringId = R.string.error_drm_unknown;
                if (Util.SDK_INT < 18) {
                    errorStringId = R.string.error_drm_not_supported;
                } else {
                    try {
                        String drmSchemeExtra = intent.hasExtra(DRM_SCHEME_EXTRA) ? DRM_SCHEME_EXTRA
                                : DRM_SCHEME_UUID_EXTRA;
                        UUID drmSchemeUuid = Util.getDrmUuid(intent.getStringExtra(drmSchemeExtra));
                        if (drmSchemeUuid == null) {
                            errorStringId = R.string.error_drm_unsupported_scheme;
                        } else {
                            boolean isOffline = intent.getBooleanExtra(IS_OFFLINE_EXTRA, false);
                            if(isOffline){
                                String keyResponse = intent.getStringExtra(KEY_RESPONSE_EXTRA);
                                drmSessionManager = buildOfflineDrmSessionManagerV18(
                                        drmSchemeUuid, keyResponse);
                            } else {
                                drmSessionManager =
                                        buildDrmSessionManagerV18(
                                                drmSchemeUuid, drmLicenseUrl, keyRequestPropertiesArray, multiSession);
                            }

                        }
                    } catch (UnsupportedDrmException e) {
                        errorStringId = e.reason == UnsupportedDrmException.REASON_UNSUPPORTED_SCHEME
                                ? R.string.error_drm_unsupported_scheme : R.string.error_drm_unknown;
                    }
                }
                if (drmSessionManager == null) {
                    showToast(errorStringId);
                    finish();
                    return;
                }
            }

            TrackSelection.Factory trackSelectionFactory;
            String abrAlgorithm = intent.getStringExtra(ABR_ALGORITHM_EXTRA);
            if (abrAlgorithm == null || ABR_ALGORITHM_DEFAULT.equals(abrAlgorithm)) {
                trackSelectionFactory = new AdaptiveTrackSelection.Factory();
            } else if (ABR_ALGORITHM_RANDOM.equals(abrAlgorithm)) {
                trackSelectionFactory = new RandomTrackSelection.Factory();
            } else {
                showToast(R.string.error_unrecognized_abr_algorithm);
                finish();
                return;
            }

            boolean preferExtensionDecoders =
                    intent.getBooleanExtra(PREFER_EXTENSION_DECODERS_EXTRA, false);
            RenderersFactory renderersFactory =
                    ((MainApplication) getApplication()).buildRenderersFactory(preferExtensionDecoders);

            trackSelector = new DefaultTrackSelector(trackSelectionFactory);
            trackSelector.setParameters(trackSelectorParameters);
            trackSelector.setTunnelingAudioSessionId(C.generateAudioSessionIdV21(this));
            lastSeenTrackGroupArray = null;

            player =
                    ExoPlayerFactory.newSimpleInstance(
                            /* context= */ this, renderersFactory, trackSelector, drmSessionManager);
            player.addListener(new PlayerEventListener());
            player.setPlayWhenReady(startAutoPlay);
            player.setPlaybackParameters(
                    new PlaybackParameters((float)PlayBackSpeedDialog.getSpeedFromPos(playbackSpeed))
            );
            player.addAnalyticsListener(new EventLogger(trackSelector));
            playerView.setPlayer(player);
            playerView.setPlaybackPreparer(this);

            MediaSource[] mediaSources = new MediaSource[uris.length];
            for (int i = 0; i < uris.length; i++) {
                mediaSources[i] = buildMediaSource(uris[i], extensions[i]);
            }
            mediaSource =
                    mediaSources.length == 1 ? mediaSources[0] : new ConcatenatingMediaSource(mediaSources);
            String adTagUriString = intent.getStringExtra(AD_TAG_URI_EXTRA);
            if (adTagUriString != null) {
                Uri adTagUri = Uri.parse(adTagUriString);
                if (!adTagUri.equals(loadedAdTagUri)) {
                    releaseAdsLoader();
                    loadedAdTagUri = adTagUri;
                }
                MediaSource adsMediaSource = createAdsMediaSource(mediaSource, Uri.parse(adTagUriString));
                if (adsMediaSource != null) {
                    mediaSource = adsMediaSource;
                } else {
                    showToast(R.string.ima_not_loaded);
                }
            } else {
                releaseAdsLoader();
            }
        }
        boolean haveStartPosition = startWindow != C.INDEX_UNSET;
        if (haveStartPosition) {
            player.seekTo(startWindow, startPosition);
        }
        player.prepare(mediaSource, !haveStartPosition, false);
        updateButtonVisibility();
    }

    private MediaSource buildMediaSource(Uri uri) {
        return buildMediaSource(uri, null);
    }

    private MediaSource buildMediaSource(Uri uri, @Nullable String overrideExtension) {
        DownloadRequest downloadRequest =
                ((MainApplication) getApplication()).getDownloadTracker().getDownloadRequest(uri);
        if (downloadRequest != null) {
            return DownloadHelper.createMediaSource(downloadRequest, dataSourceFactory);
        }
        @ContentType int type = Util.inferContentType(uri, overrideExtension);
        switch (type) {
            case C.TYPE_DASH:
                return new DashMediaSource.Factory(dataSourceFactory).createMediaSource(uri);
            case C.TYPE_SS:
                return new SsMediaSource.Factory(dataSourceFactory).createMediaSource(uri);
            case C.TYPE_HLS:
                return new HlsMediaSource.Factory(dataSourceFactory).createMediaSource(uri);
            case C.TYPE_OTHER:
                return new ProgressiveMediaSource.Factory(dataSourceFactory).createMediaSource(uri);
            default:
                throw new IllegalStateException("Unsupported type: " + type);
        }
    }

    private DefaultDrmSessionManager<FrameworkMediaCrypto> buildDrmSessionManagerV18(
            UUID uuid, String licenseUrl, String[] keyRequestPropertiesArray, boolean multiSession)
            throws UnsupportedDrmException {
        HttpDataSource.Factory licenseDataSourceFactory =
                ((MainApplication) getApplication()).buildHttpDataSourceFactory();
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

    private DefaultDrmSessionManager<FrameworkMediaCrypto> buildOfflineDrmSessionManagerV18(
            UUID uuid, String keyresponse) throws UnsupportedDrmException {
        LocalMediaDrmCallback drmCallback = new LocalMediaDrmCallback(keyresponse.getBytes());
        releaseMediaDrm();
        mediaDrm = FrameworkMediaDrm.newInstance(uuid);
        DefaultDrmSessionManager<FrameworkMediaCrypto> drmSessionManager = new DefaultDrmSessionManager<>(
                uuid, mediaDrm, drmCallback, null, false);
        return drmSessionManager;
    }

    private void releasePlayer() {
        if (player != null) {
            updateTrackSelectorParameters();
            updateStartPosition();
//      debugViewHelper.stop();
//      debugViewHelper = null;
            player.release();
            player = null;
            mediaSource = null;
            trackSelector = null;
        }
        if (adsLoader != null) {
            adsLoader.setPlayer(null);
        }
        releaseMediaDrm();
    }

    private void releaseMediaDrm() {
        if (mediaDrm != null) {
            mediaDrm.release();
            mediaDrm = null;
        }
    }

    private void releaseAdsLoader() {
        if (adsLoader != null) {
            adsLoader.release();
            adsLoader = null;
            loadedAdTagUri = null;
            playerView.getOverlayFrameLayout().removeAllViews();
        }
    }

    private void updateTrackSelectorParameters() {
        if (trackSelector != null) {
            trackSelectorParameters = trackSelector.getParameters();
        }
    }

    private void updateStartPosition() {
        if (player != null) {
            startAutoPlay = player.getPlayWhenReady();
            startWindow = player.getCurrentWindowIndex();
            startPosition = Math.max(0, player.getContentPosition());
            playbackSpeed = PlayBackSpeedDialog.getPosFromSpeed(player.getPlaybackParameters().speed);
        }
    }

    private void clearStartPosition() {
        startAutoPlay = true;
        startWindow = C.INDEX_UNSET;
        startPosition = C.TIME_UNSET;
        playbackSpeed = PlayBackSpeedDialog.POS_NORMAL;
    }

    /** Returns a new DataSource factory. */
    private DataSource.Factory buildDataSourceFactory() {
        return ((MainApplication) getApplication()).buildDataSourceFactory();
    }

    /** Returns an ads media source, reusing the ads loader if one exists. */
    private @Nullable MediaSource createAdsMediaSource(MediaSource mediaSource, Uri adTagUri) {
        // Load the extension source using reflection so the demo app doesn't have to depend on it.
        // The ads loader is reused for multiple playbacks, so that ad playback can resume.
        try {
            Class<?> loaderClass = Class.forName("com.google.android.exoplayer2.ext.ima.ImaAdsLoader");
            if (adsLoader == null) {
                // Full class names used so the LINT.IfChange rule triggers should any of the classes move.
                // LINT.IfChange
                Constructor<? extends AdsLoader> loaderConstructor =
                        loaderClass
                                .asSubclass(AdsLoader.class)
                                .getConstructor(android.content.Context.class, android.net.Uri.class);
                // LINT.ThenChange(../../../../../../../../proguard-rules.txt)
                adsLoader = loaderConstructor.newInstance(this, adTagUri);
            }
            adsLoader.setPlayer(player);
            AdsMediaSource.MediaSourceFactory adMediaSourceFactory =
                    new AdsMediaSource.MediaSourceFactory() {
                        @Override
                        public MediaSource createMediaSource(Uri uri) {
                            return PlayerActivity.this.buildMediaSource(uri);
                        }

                        @Override
                        public int[] getSupportedTypes() {
                            return new int[] {C.TYPE_DASH, C.TYPE_SS, C.TYPE_HLS, C.TYPE_OTHER};
                        }
                    };
            return new AdsMediaSource(mediaSource, adMediaSourceFactory, adsLoader, playerView);
        } catch (ClassNotFoundException e) {
            // IMA extension not loaded.
            return null;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // User controls

    private void updateButtonVisibility() {
//    selectTracksButton.setEnabled(
//        player != null && TrackSelectionDialog.willHaveContent(trackSelector));
    }

    private void showControls() {
//    debugRootView.setVisibility(View.VISIBLE);
    }

    private void showToast(int messageId) {
        showToast(getString(messageId));
    }

    private void showToast(String message) {
        Toast.makeText(getApplicationContext(), message, Toast.LENGTH_LONG).show();
    }

    private static boolean isBehindLiveWindow(ExoPlaybackException e) {
        if (e.type != ExoPlaybackException.TYPE_SOURCE) {
            return false;
        }
        Throwable cause = e.getSourceException();
        while (cause != null) {
            if (cause instanceof BehindLiveWindowException) {
                return true;
            }
            cause = cause.getCause();
        }
        return false;
    }

    private class PlayerEventListener implements Player.EventListener {

        @Override
        public void onPlayerStateChanged(boolean playWhenReady, int playbackState) {
            if (playbackState == Player.STATE_ENDED) {
                showControls();
            }
            updateButtonVisibility();
        }

        @Override
        public void onPlayerError(ExoPlaybackException e) {
            if (isBehindLiveWindow(e)) {
                clearStartPosition();
                initializePlayer();
            } else {
                updateButtonVisibility();
                showControls();
            }
        }

        @Override
        @SuppressWarnings("ReferenceEquality")
        public void onTracksChanged(TrackGroupArray trackGroups, TrackSelectionArray trackSelections) {
            updateButtonVisibility();
            if (trackGroups != lastSeenTrackGroupArray) {
                MappedTrackInfo mappedTrackInfo = trackSelector.getCurrentMappedTrackInfo();
                if (mappedTrackInfo != null) {
                    if (mappedTrackInfo.getTypeSupport(C.TRACK_TYPE_VIDEO)
                            == MappedTrackInfo.RENDERER_SUPPORT_UNSUPPORTED_TRACKS) {
                        showToast(R.string.error_unsupported_video);
                    }
                    if (mappedTrackInfo.getTypeSupport(C.TRACK_TYPE_AUDIO)
                            == MappedTrackInfo.RENDERER_SUPPORT_UNSUPPORTED_TRACKS) {
                        showToast(R.string.error_unsupported_audio);
                    }
                }
                lastSeenTrackGroupArray = trackGroups;
            }
        }
    }

    private class PlayerErrorMessageProvider implements ErrorMessageProvider<ExoPlaybackException> {

        @Override
        public Pair<Integer, String> getErrorMessage(ExoPlaybackException e) {
            String errorString = getString(R.string.error_generic);
            if (e.type == ExoPlaybackException.TYPE_RENDERER) {
                Exception cause = e.getRendererException();
                if (cause instanceof DecoderInitializationException) {
                    // Special case for decoder initialization failures.
                    DecoderInitializationException decoderInitializationException =
                            (DecoderInitializationException) cause;
                    if (decoderInitializationException.decoderName == null) {
                        if (decoderInitializationException.getCause() instanceof DecoderQueryException) {
                            errorString = getString(R.string.error_querying_decoders);
                        } else if (decoderInitializationException.secureDecoderRequired) {
                            errorString =
                                    getString(
                                            R.string.error_no_secure_decoder, decoderInitializationException.mimeType);
                        } else {
                            errorString =
                                    getString(R.string.error_no_decoder, decoderInitializationException.mimeType);
                        }
                    } else {
                        errorString =
                                getString(
                                        R.string.error_instantiating_decoder,
                                        decoderInitializationException.decoderName);
                    }
                }
            }
            return Pair.create(0, errorString);
        }
    }

}
