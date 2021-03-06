import React from 'react';
import { withNavigation } from 'react-navigation';
import {
    Dimensions,
    SafeAreaView,
    Platform,
    StatusBar,
    ScrollView,
    StyleSheet,
    Image,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    Modal
} from 'react-native';
import { Images, Colors } from "../constants";
import { ParagraphText1, ParagraphText2, HeadingText1, HeadingText2, HeadingText3 } from '../components/Texts';
const { width, height } = Dimensions.get("screen");
import { hook } from 'cavy';


class AllReviewsScreen extends React.Component {

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={{ flex: 1 }}>
                        <ImageBackground
                            source={Images.ProfileBackground}
                            style={styles.reviewContainer}
                            imageStyle={styles.background}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                style={styles.itemContainer}>
                                <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.goBack()}
                                    ref={this.props.generateTestHook('AllReviewsBack.Button')}>
                                    <HeadingText1 style={[{ color: Colors.white }, styles.shadow]}> Back </HeadingText1>
                                </TouchableOpacity>
                                <View style={styles.innerContainer}>
                                    <View style={styles.list}>
                                        <HeadingText1 style={{
                                            marginTop: 30,
                                            marginBottom: 10,
                                            color: Colors.placeholder,
                                        }}>A L L  R E V I E W S</HeadingText1>
                                        {this.props.navigation.state.params.reviews}
                                    </View>
                                </View>
                            </ScrollView>
                        </ImageBackground>
                    </View>
                </View >
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        marginBottom: 40,
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    background: {
        marginTop: -20,
        height: height / 2,
        width: width
    },
    reviewContainer: {
        width: width,
        height: height,
        padding: 0,
        zIndex: 1
    },
    innerContainer: {
        marginTop: 40,
        marginHorizontal: 10,
        marginBottom: 40,
        paddingBottom: 10,
        borderRadius: 10,
        zIndex: 5,
        backgroundColor: Colors.white,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 10,
        shadowOpacity: 0.25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    list: {
        flex: 1,
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
    },
    back: {
        position: "absolute",
        left: 12,
        top: 10,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 10,
        shadowOpacity: 0.7,
    },
    shadow: {
        shadowColor: Colors.black,
        shadowOffset: { width: -1, height: 1 },
        shadowRadius: 1,
        shadowOpacity: 1,
    },
});

//export default withNavigation(AllReviewsScreen);
const AllReviewsScreenSpec = hook(AllReviewsScreen);
export default (AllReviewsScreenSpec);