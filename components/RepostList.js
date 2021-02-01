/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React from 'react'; 
import { ReactionList, SectionHeader } from 'react-native-activity-feed';
import RepostItem from './RepostItem';
import type { ReactionMap } from '../types';

type Props = {
    reactions: ?ReactionMap,
};

const RepostList = ({ reactions, activityId }: Props) => {
    return (
        <ReactionList
            activityId={activityId}
            reactions={reactions}
            reactionKind={'repost'}
            Reaction={(reaction) => <RepostItem repost={reaction} />}
        >
            <SectionHeader>Reposts</SectionHeader>
        </ReactionList>
    );
};

export default RepostList;
