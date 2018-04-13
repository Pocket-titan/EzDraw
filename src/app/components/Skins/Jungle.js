import * as Colors from 'material-ui/styles/colors';
import * as ColorManipulator from 'material-ui/utils/colorManipulator';

export default {
  palette: {
    //Primary color (slider, textfield, timer, specialMessage)
    primary1Color: '#85b860',
    //Site background color
    backgroundColor: '#5C4C4D',
    //Panel background color
    panelColor: '#988777',
    //Users panel header color
    panelHeaderColor: '#7ca261',
    //User backgound color
    userBackgroundColor: '#8f7e6f',
    //Slider background
    primary3Color: '#5C4C4D',
    //Slider active background
    accent3Color: '#5C4C4D',
    //Score buttons
    accent1Color: '#8f8f17',
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
