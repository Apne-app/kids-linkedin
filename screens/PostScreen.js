
/* eslint-disable */
import React from 'react';
import { Text, Image, TouchableOpacity } from 'react-native';
import { StatusUpdateForm, StreamApp, UploadImage } from 'react-native-activity-feed';
const PostScreen = () => {
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

  return (
    <StreamApp
      apiKey={'dfm952s3p57q'}
      appId={'90935'}
      token={'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDlpZCJ9.A89Wjxxk_7hVBFyoSREkPhLCHsYY6Vq66MrBuOTm_mQ'}
    >
      <StatusUpdateForm  modifyActivityData={(data) => ({...data, video:'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4'})} />
    </StreamApp>
  );
}

export default PostScreen;
