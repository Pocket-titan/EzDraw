import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';

export default {
  palette: {
    //Primary color (slider, textfield, timer, specialMessage)
    primary1Color: '#3d6b98',
    //Site background color
    backgroundColor: '#483E3D',
    //Panel background color
    panelColor: '#C28B64',
    //Users panel header color
    panelHeaderColor: '#556A7F',
    //User backgound color
    userBackgroundColor: '#B58E6F',
    //Slider background
    primary3Color: '#483E3D',
    //Slider active background
    accent3Color: '#483E3D',
    //Score buttons
    accent1Color: '#4d2203',
    //Borders
    borderColor: '#483E3D',
    //Server message
    serverText: '#b53918',
    //Error color
    errorColor: '#b53918',

    primary2Color: Colors.red700,
    accent2Color: Colors.grey100,
    textColor: 'black',
    alternateTextColor: Colors.white,
    canvasColor: Colors.white,
    disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.5),
    pickerHeaderColor: Colors.cyan500,
  },
}
