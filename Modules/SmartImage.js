import React from 'react'

import FastImage from 'react-native-fast-image'


class SmartImage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imageLoading: true
        }
    }

    imageLoadProgress = (e) => {
        this.setState({ imageLoading: false })
        this.props.onProgress && this.props.onProgress(e)
    }
    imageLoadError = () => {
        this.setState({ imageLoading: false })
        this.props.onError && this.props.onError()
    }

    imageLoad = (e) => {
        this.setState({ imageLoading: true })
        this.props.onLoad && this.props.onLoad(e)
    }

    render() {
        let { source } = this.props
        const { style, resizeMode } = this.props
        const { imageLoading } = this.state

        source = imageLoading ? source : this.props.placeholder;

        return (
            <FastImage
                {...this.props}
                style={style}
                source={source}
                fallback={!this.state.imageLoading}
                onError={this.imageLoadError}
                onProgress={this.imageLoadProgress}
                onLoadEnd={this.imageLoad}
            />
        )
    }
}


export default SmartImage