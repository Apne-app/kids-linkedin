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
import RepostList from '../components/RepostList';
import type { UserResponse } from '../types';
import { NavigationScreen, StreamApp } from 'react-native-activity-feed';
import ReplyIcon from '../images/icons/reply.png';

type Props = {|
  navigation: NavigationScreen,
|};

export default class SinglePostScreen extends React.Component<Props> {
  static navigationOptions = ({ navigation }: Props) => ({
    title: 'POST DETAIL',
    headerLeft: (
      <View style={{ paddingLeft: 15 }}>
        <BackButton pressed={() => navigation.goBack()} blue />
      </View>
    ),
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 13,
    },
  });

  render() {
    const { navigation } = this.props;
    const activity = {
      actor: {
        data: {
          name: 'Terry Walker',
          profileImage: 'https://randomuser.me/api/portraits/women/48.jpg',
        },
      },
      object: 'Hey @Thierry how are you doing?',
      verb: 'post',
      time: new Date(),
    };
    const feedGroup = 'user'
    const userId = '49id'
    return (
      <SafeAreaView style={styles.container}>
        <StreamApp
          apiKey={'dfm952s3p57q'}
          appId={'90935'}
          token={'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDlpZCJ9.A89Wjxxk_7hVBFyoSREkPhLCHsYY6Vq66MrBuOTm_mQ'}
          defaultUserData={{
            name: 'Batman',
            url: 'batsignal.com',
            desc: 'Smart, violent and brutally tough solutions to crime.',
            profileImage:
              'https://i.kinja-img.com/gawker-media/image/upload/s--PUQWGzrn--/c_scale,f_auto,fl_progressive,q_80,w_800/yktaqmkm7ninzswgkirs.jpg',
            coverImage:
              'https://i0.wp.com/photos.smugmug.com/Portfolio/Full/i-mwrhZK2/0/ea7f1268/X2/GothamCity-X2.jpg?resize=1280%2C743&ssl=1',
          }}
        >
        <SinglePost
          activity={activity}
          feedGroup={feedGroup}
          userId={userId}
          navigation={this.props.navigation}
          Activity={(props) => console.log(props.activity.id) || (
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
              <CommentList activityId={props.activity} />

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
                    data: { text: text },
                  })
                }
                avatarProps={{
                  source: (userData: UserResponse) =>
                    userData.data.profileImage,
                }}
                styles={{ container: { height: 78 } }}
              />
            );
          }}
        />
        </StreamApp>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
