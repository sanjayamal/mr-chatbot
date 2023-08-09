import React from "react";
import { useAuth, useCurrentUser } from "../../hooks";
import {
  CAvatar,
  CButton,
  CDropdown,
  CImage,
  CMenuProps,
  CSkeleton,
} from "../common";
import { CLogoutOutlined, CUserOutlined } from "../common/icons";
import { Link, useNavigate } from "react-router-dom";
import "./CurrentUser.scss";

interface ICurrentName {
  isNameHide: boolean;
}

const CurrentUser: React.FC<ICurrentName> = ({ isNameHide }) => {
  const auth = useAuth();

  const { currentUser, isFetching } = useCurrentUser();
  const { profilePictureUrl, name } = {
    profilePictureUrl: "",
    ...currentUser,
  };

  const { logout } = auth;
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const result = await logout();
      if (result) {
        navigate("/");
      }
    } catch (error) {}
  };
  const items: CMenuProps["items"] = [
    {
      key: "1",
      label: <Link to="/change-password"> Change Password</Link>,
    },
    {
      key: "2",
      label: (
        <CButton
          icon={<CLogoutOutlined />}
          onClick={() => handleSignOut()}
          type="link"
        >
          Log out
        </CButton>
      ),
    },
  ];
  return (
    <CDropdown menu={{ items }}>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          paddingLeft: "10px",
        }}
      >
        <CAvatar
          style={{ backgroundColor: "#87d068" }}
          size={{ xs: 24, sm: 32, md: 40 }}
          icon={
            profilePictureUrl ? (
              <CImage src={profilePictureUrl} />
            ) : (
              <CUserOutlined />
            )
          }
        />
        {!isNameHide && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: "5px",
            }}
          >
            {isFetching ? <CSkeleton.Button active /> : name}
          </div>
        )}
      </div>
    </CDropdown>
  );
};

export default CurrentUser;
