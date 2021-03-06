import React from 'react';
import { withNavigation } from 'react-navigation';
import {
    Dimensions,
    Platform,
    StatusBar,
    ScrollView,
    StyleSheet,
    Image,
    ActivityIndicator,
    View,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    Modal
} from 'react-native';

const { height, width } = Dimensions.get('screen');
import { Colors, Images, businesses, user } from '../constants';
import { ParagraphText1, ParagraphText2, HeadingText1, HeadingText2 } from '../components/Texts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { hook } from 'cavy'
import mapController from "../controllers/MapController";
import userController from '../controllers/UserController';
import { NavigationActions, StackActions } from 'react-navigation';
const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'User' })],
    });


class AddBusinessScreen extends React.Component {
    state = {
        businessTitleInput: '',
        aboutInput: '',
        priceInput: '',
        regionInput: '',
        tag1Input: '',
        tag2Input: '',
        tag3Input: '',
        success: false,
        loading: false
    };

    componentDidMount() {
    }

    updateBusinessTitle = (businessTitleInput) => {
        this.setState({ businessTitleInput });
    };

    updateAbout = (aboutInput) => {
        this.setState({ aboutInput });
    };

    updatePrice = (priceInput) => {
        this.setState({ priceInput });
    };

    updateRegion = (regionInput) => {
        this.setState({ regionInput });
    };

    updateTag1 = (tag1Input) => {
        this.setState({ tag1Input });
    };

    updateTag2 = (tag2Input) => {
        this.setState({ tag2Input });
    };

    updateTag3 = (tag3Input) => {
        this.setState({ tag3Input });
    };

    addBusiness = async () => {
        const location = await mapController.geocodeFromCity(this.state.regionInput)
        const geocode = {
            lat: location.lat,
            long: location.long
        }
        userController.addBusiness({
            title: this.state.businessTitleInput,
            about: this.state.aboutInput,
            price: this.state.priceInput,
            region: this.state.regionInput,
            location: geocode,
            tags: [this.state.tag1Input, this.state.tag2Input, this.state.tag3Input],
            images: ['https://source.unsplash.com/featured/?'+this.state.tag1Input, 'https://source.unsplash.com/featured/?'+this.state.tag2Input]
        })
            .then((res) => {
                if (res !== 404) {
                    this.setState({
                        loading: true 
                    })

                    setTimeout(() => {
                        this.setState({
                            success: true,
                            loading: false
                        })
                    }, 1000)

                    setTimeout(() => {
                        this.props.navigation.dispatch(resetAction);
                    }, 2000)
                }
            })
    }


    renderSuccess() {
        return (
            <Modal
                animationType="fade"
                transparent={false}
                visible={this.state.success}>
                <View style={styles.modal}>
                        <HeadingText1 style={{ fontSize: 16, marginTop: 30, marginHorizontal: 15, justifyContent: "center", alignSelf: "center" }}>Successfully added new business!</HeadingText1>
                </View>
            </Modal>
        )
    }



    renderLoading() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.loading}>
                <View style={styles.loadingModal}>
                    <ActivityIndicator style={styles.loading} size="large" color="#ffffff" />
                </View>
            </Modal>
        )
    }

    render() {

        const { aboutInput } = this.state;
        const { businessTitleInput } = this.state;
        const { priceInput } = this.state;
        const { regionInput } = this.state;
        const { tag1Input } = this.state;
        const { tag2Input } = this.state;
        const { tag3Input } = this.state;

        return (
            <KeyboardAwareScrollView style={styles.container}>
                {this.state.success && this.renderSuccess()}
                {this.state.loading && this.renderLoading()}
                <View style={{ flex: 1 }}>
                    <ImageBackground
                        source={{ uri: businesses[0].images[0] }}
                        style={styles.profileContainer}
                        imageStyle={styles.profileBackground}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}>
                            <TouchableOpacity
                                ref={this.props.generateTestHook('AddServiceBack.Button')}
                                style={styles.backButton} onPress={() => this.props.navigation.goBack()}>
                                <HeadingText1 style={styles.heading1}>Cancel</HeadingText1>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={this.addBusiness}>
                                <HeadingText1 style={styles.heading1}>Add</HeadingText1>
                            </TouchableOpacity>
                            <View style={styles.profileCard}>
                                <View style={styles.profilePicContainer}>
                                    <Image source={{ uri: user.profilePic }} style={styles.profilePic} />
                                </View>
                                <View style={styles.resultDescription}>
                                    <TextInput
                                        ref={this.props.generateTestHook('AddServiceTitle.TextInput')}
                                        style={styles.titleInput}
                                        onChangeText={this.updateBusinessTitle}
                                        inputContainerStyle={{ backgroundColor: Colors.white }}
                                        containerStyle={{ backgroundColor: '#ffffff' }}
                                        inputStyle={{ fontSize: 13 }}
                                        value={businessTitleInput}
                                        placeholder={"Your service title e.g. Homecooked Pasta"}
                                        placeholderTextColor={Colors.placeholder} />
                                    <TextInput
                                        ref={this.props.generateTestHook('AddServicePrice.TextInput')}
                                        style={styles.titleInput}
                                        onChangeText={this.updatePrice}
                                        inputContainerStyle={{ backgroundColor: Colors.white }}
                                        containerStyle={{ backgroundColor: '#ffffff' }}
                                        inputStyle={{ fontSize: 13 }}
                                        value={priceInput}
                                        placeholder={"Your general price or price range e.g. $30/hr"}
                                        placeholderTextColor={Colors.placeholder} />
                                    <TextInput
                                        ref={this.props.generateTestHook('AddServiceRegion.TextInput')}
                                        style={styles.titleInput}
                                        onChangeText={this.updateRegion}
                                        inputContainerStyle={{ backgroundColor: Colors.white }}
                                        containerStyle={{ backgroundColor: '#ffffff' }}
                                        inputStyle={{ fontSize: 13 }}
                                        value={regionInput}
                                        placeholder={"Your general location e.g. Downtown Vancouver"}
                                        placeholderTextColor={Colors.placeholder} />
                                    <View style={{ justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row' }}>
                                        <TextInput
                                            ref={this.props.generateTestHook('AddServiceTag1.TextInput')}
                                            style={styles.tagInput}
                                            onChangeText={this.updateTag1}
                                            inputContainerStyle={{ backgroundColor: Colors.white }}
                                            containerStyle={{ backgroundColor: '#ffffff' }}
                                            inputStyle={{ fontSize: 13 }}
                                            value={tag1Input}
                                            placeholder={"Tag e.g. fun"}
                                            placeholderTextColor={Colors.placeholder} />
                                        <TextInput
                                            ref={this.props.generateTestHook('AddServiceTag2.TextInput')}
                                            style={styles.tagInput}
                                            onChangeText={this.updateTag2}
                                            inputContainerStyle={{ backgroundColor: Colors.white }}
                                            containerStyle={{ backgroundColor: '#ffffff' }}
                                            inputStyle={{ fontSize: 13 }}
                                            value={tag2Input}
                                            placeholder={"Tag e.g. spa"}
                                            placeholderTextColor={Colors.placeholder} />
                                        <TextInput
                                            ref={this.props.generateTestHook('AddServiceTag3.TextInput')}
                                            style={styles.tagInput}
                                            onChangeText={this.updateTag3}
                                            inputContainerStyle={{ backgroundColor: Colors.white }}
                                            containerStyle={{ backgroundColor: '#ffffff' }}
                                            inputStyle={{ fontSize: 13 }}
                                            value={tag3Input}
                                            placeholder={"Tag e.g. nails"}
                                            placeholderTextColor={Colors.placeholder} />
                                    </View>
                                    <TextInput
                                        ref={this.props.generateTestHook('AddServiceAbout.TextInput')}
                                        multiline={true}
                                        style={styles.aboutInput}
                                        onChangeText={this.updateAbout}
                                        inputContainerStyle={{ backgroundColor: Colors.white }}
                                        containerStyle={{ backgroundColor: '#ffffff' }}
                                        inputStyle={{ fontSize: 13 }}
                                        value={aboutInput}
                                        placeholder={"Write about your service..."}
                                        placeholderTextColor={Colors.placeholder} />
                                    <View style={styles.photos}>
                                        <HeadingText1 style={{ marginBottom: 10, alignSelf: 'center', marginTop: 10, color: Colors.placeholder }}>P H O T O S</HeadingText1>
                                        <TouchableOpacity style={styles.upload}>
                                            <ParagraphText2 style={{ marginRight: 7, fontSize: 12, color: Colors.highlight }}>u p l o a d</ParagraphText2>
                                            <Image source={require('../assets/icons/icons8-add-image-96.png')} style={{ height: 18, width: 18 }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </ImageBackground>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)'
    },
    modal: {
        backgroundColor: Colors.white,
        minHeight: height * 0.15,
        marginTop: height * 0.45,
        marginHorizontal: 10,
        borderRadius: 20,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 150,
        paddingVertical: 5
    },
    loadingModal: {
        backgroundColor: Colors.black,
        opacity: 0.5,
        height: height,
        width: width
    },
    loading: {
        marginTop: height / 2,
    },
    profileBackground: {
        height: height / 2,
        width: width
    },
    backButton: {
        position: "absolute",
        top: 20,
        left: 10,
        margin: 10,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 10,
        shadowOpacity: 0.7,
    },
    saveButton: {
        position: "absolute",
        top: 20,
        right: 10,
        margin: 10,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 10,
        shadowOpacity: 0.7,
    },
    profileContainer: {
        width: width,
        height: height - 50,
        padding: 0,
        zIndex: 1
    },
    profileCard: {
        marginTop: height / 4.5,
        marginHorizontal: 10,
        marginBottom: 20,
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
    resultDescription: {
        flex: 1,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    profilePicContainer: {
        position: "relative",
        marginTop: -70,
        padding: 2,
        zIndex: 5
    },
    profilePic: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 10,
        borderColor: Colors.white
    },
    heading1: {
        fontSize: 14,
        color: Colors.white,
        shadowColor: Colors.black,
        shadowOffset: { width: -1, height: 1 },
        shadowRadius: 1,
        shadowOpacity: 1,
    },
    titleInput: {
        width: width - 65,
        height: 35,
        borderRadius: 10,
        paddingHorizontal: 10,
        borderColor: Colors.highlight,
        borderWidth: 1,
        marginBottom: 20,
    },
    aboutInput: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 10,
        textAlignVertical: 'top',
        width: width - 65,
        borderWidth: 1,
        borderColor: Colors.highlight,
        borderRadius: 10,
        zIndex: 1,
        marginBottom: 25,
    },
    tagInput: {
        width: width / 3 - 28,
        height: 35,
        borderRadius: 10,
        paddingHorizontal: 10,
        borderColor: Colors.highlight,
        borderWidth: 1,
        marginHorizontal: 5,
        marginBottom: 20,
    },
    photos: {
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        color: Colors.placeholder,
    },
    upload: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 30,
        borderColor: Colors.highlight,
        paddingVertical: 5,
        paddingHorizontal: 30,
        width: width - 65,
    },
});

//export default withNavigation(BusinessScreen);
const AddBusinessSpec = hook(AddBusinessScreen);
export default (AddBusinessSpec);