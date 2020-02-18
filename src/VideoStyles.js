import {Dimensions, StyleSheet} from 'react-native';

const screen = Dimensions.get('window'),
  vh = screen.height / 100,
  vw = screen.width / 100;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100 * vw,
    width: 100 * vh,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e7e7e7',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  controls: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingBottom: 5 * vw,
    paddingTop: 5 * vw,
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  innerProgressCompleted: {
    height: 20,
    backgroundColor: '#cccccc',
  },
  innerProgressRemaining: {
    height: 20,
    backgroundColor: '#2C2C2C',
  },
  generalControls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
   sharebox:{
    height : 10 * vh,
    width : 10 * vh,
    borderRadius: 5 * vh,
    backgroundColor : '#921bd0',
    elevation: 10,
    position: 'absolute',
    marginTop: 85 * vh ,
    marginRight : 15 * vw,
    alignItems:'center',
    justifyContent:'center',
    alignSelf: 'flex-end'

  },
  shareIcon: {
    resizeMode: 'contain',
    height: '60%',
    width: '60%',
    elevation: 3
  },
  rateControl: {
    width: 66 * vh,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  controlTitle: {
    fontSize: 6 * vw,
    color: 'white',
    marginBottom: 7.5 * vw,
  },
  volumeControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resizeModeControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlOption: {
    alignSelf: 'center',
    fontSize: 4 * vw,
    color: 'white',
    paddingLeft: 2,
    paddingRight: 2,
  },
  trackingControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '95%',
    alignSelf: 'center',
    
    bottom: 5 * vw,
  },
  seek: {
    width: 70 * vh,
    flex: 18
  },
  trackStyle: {
    backgroundColor: 'rgba(256,256,256,0.4)',
    height: '8%'
  },
  thumbStyle: {
    height: 3 * vw,
    width: 3 * vw,
    borderRadius: 1.5 * vw
  },
  timeLabelText: {
    flex: 2,
    color: 'white',
    textAlign: 'center',
  },
  videoTitle: {
    color: 'white',
    position: 'absolute',
    top: 5 * vw,
    left: 2.5 * vh,
    fontSize: 4 * vw,
    width: 80 * vh,
  },
  fullScreenIcon: {
    flex: 1,
    width: 10 * vh,
    height: 4 * vw,
  },
  settingsIcon: {
    position: 'absolute',
    top: 5 * vw,
    right: 0,
    width: 10 * vh,
    height: 4 * vw,
  },
  muteIcon: {
    position: 'absolute',
    top: 5 * vw,
    right: 10 * vw,
    width: 10 * vh,
    height: 4 * vw,
  },
  playIcon: {
    height: 10 * vw,
    width: 10 * vw,
  },
  buffering: {
    backgroundColor: "#000",
  },
});

export default styles;