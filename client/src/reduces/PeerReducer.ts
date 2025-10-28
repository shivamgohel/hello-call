import { ADD_PEER, REMOVE_PEER } from "../actions/PeerAction";

// contains peerId (user) as key and MediaStream (stream from the user) as value
// there are 3 users in a room, the state will look like:
// {
//     user1:  stream,
//     user2:  stream,
//     user3:  stream,
// }
export type PeerState = Record<string, { stream: MediaStream }>;

type PeerAction =
  | {
      type: typeof ADD_PEER;
      payload: { peerId: string; stream: MediaStream };
    }
  | {
      type: typeof REMOVE_PEER;
      payload: { peerId: string };
    };

export const peerReducer = (
  state: PeerState,
  action: PeerAction
): PeerState => {
  switch (action.type) {
    case ADD_PEER:
      return {
        ...state,
        [action.payload.peerId]: {
          stream: action.payload.stream,
        },
      };
    case REMOVE_PEER: {
      const { peerId } = action.payload;
      const newState = { ...state };

      delete newState[peerId];
      return newState;
    }
    default:
      return state;
  }
};
