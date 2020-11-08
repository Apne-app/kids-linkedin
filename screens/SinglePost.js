/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';

import {
    SinglePost,
    CommentBox,
    BackButton,
    Activity,
    LikeButton,
    ReactionIcon,
    CommentList,
    LikeList,
} from 'react-native-activity-feed';
import { NavigationScreen, StreamApp } from 'react-native-activity-feed';
import ReplyIcon from '../images/icons/reply.png';
export default function SinglePostScreen({ navigation, route }) {

    const activity = route.params.activity.activity
    const feedGroup = route.params.activity.feedGroup
    const userId = '47id'
    return (
        <SafeAreaView style={styles.container}>
            <StreamApp
                apiKey={'9ecz2uw6ezt9'}
                appId={'96078'}
                token={'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDdpZCJ9.f3hGhw0QrYAeqF8TDTNY5E0JqMF0zI6CyUmMumpWdfI'}
            >
                <SinglePost
                    activity={activity}
                    feedGroup={feedGroup}
                    userId={userId}
                    navigation={route}
                    Activity={(props) => console.log(props) || (
                        <React.Fragment>
                            <Activity
                                {...props}
                                Footer={
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <LikeButton {...props} />

                                        <ReactionIcon
                                            icon={ReplyIcon}
                                            labelSingle="comment"
                                            labelPlural="comments"
                                            counts={props.activity.reaction_counts}
                                            kind="comment"
                                        />
                                    </View>
                                }
                            />
                            <CommentList infiniteScroll activityId={props.activity.id} />

                            <View style={styles.sectionHeader} />
                            <View style={styles.likesContainer}>
                                <LikeList
                                    activityId={props.activity}
                                    reactions={props.activity.latest_reactions}
                                    reactionKind="heart"
                                />
                            </View>
                        </React.Fragment>
                    )}
                    Footer={(props) => {
                        return (
                            <CommentBox
                                onSubmit={(text) =>
                                    props.onAddReaction('comment', activity, {
                                        data: { text: 'hello' },
                                    })
                                }
                                noAvatar
                                textInputProps={{ placeholder: 'Add a comment....', height: 45, marginTop: 10, marginLeft: -1, placeholderTextColor: 'grey', }}
                                styles={{ container: { height: 80, elevation: 0, color: 'black' } }}
                            />
                        );
                    }}
                />
            </StreamApp>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
});
