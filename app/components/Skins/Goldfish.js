import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';

export default {
  palette: {
    //Primary color (slider, textfield, timer, specialMessage)
    primary1Color: '#F38630',
    //Site background color
    backgroundColor: '#05688c',
    //Panel background color
    panelColor: '#A7DBD8',
    //Users panel header color
    panelHeaderColor: '#de6107',
    //User backgound color
    userBackgroundColor: '#85c1bd',
    //Slider background
    primary3Color: '#05688c',
    //Slider active background
    accent3Color: '#05688c',
    //Score buttons
    accent1Color: '#FA6900',
    //Borders
    borderColor: '#483E3D',
    //Server message
    serverText: '#be293b',
    //Error color
    errorColor: '#90202e',

    primary2Color: Colors.red700,
    accent2Color: Colors.grey100,
    textColor: 'black',
    alternateTextColor: Colors.white,
    canvasColor: Colors.white,
    disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.5),
    pickerHeaderColor: Colors.cyan500,
  },
}
