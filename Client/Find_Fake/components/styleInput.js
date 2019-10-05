import { StyleSheet } from 'react-native';
import { PRIMARY_COLOR, SECONDARY_COLOR, PRIMARY_LIGHT, RED_LIGHT } from '../src/util/Color';
export default {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        padding: 5,
        width: 300,
        height: 40,
        fontSize: 20,
        borderColor: 'lightblue',
        borderWidth: 1,
        marginTop: 8,
        marginVertical: 15,
        borderRadius: 20
    },
    button: {
        height: 35,
        width: 150,
        margin: 10,
        borderWidth: 2,
        borderRadius: 20,
        alignItems: 'center',
        borderColor: PRIMARY_COLOR,
        justifyContent: 'center'
    },
    wrapTextInput: {
        margin: 15
    }
}