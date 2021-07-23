import { gql } from "@apollo/client";

export const FETCH_RECORDINGS = gql`
  query fetchRecordings {
    voiceRecordings {
      description
      recording_name
      id
      created_at
    }
  }
`;

export const CREATE_ACCOUNT = gql`
  mutation createAccount(
    $email: String!
    $password: String!
    $username: String!
  ) {
    createUser(
      input: {
        data: { username: $username, email: $email, password: $password }
      }
    ) {
      __typename
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    login(input: { identifier: $email, password: $password }) {
      jwt
      user {
        id
      }
    }
  }
`;

export const CREATE_RECORDING = gql`
  mutation createRecording(
    $description: String
    $name: String
    $userId: String
    $fileId: String
  ) {
    createVoiceRecording(
      input: {
        data: {
          description: $description
          recording_name: $name
          users_permissions_user: $userId
          recording: $fileId
        }
      }
    ) {
      voiceRecording {
        description
        recording_name
        recording {
          id
        }
      }
    }
  }
`;

export const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!) {
    upload(file: $file) {
      id
    }
  }
`;
