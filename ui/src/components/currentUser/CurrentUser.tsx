import React from "react";
import { useAuth } from "../../hooks";
import { CAvatar, CButton, CDropdown, CImage, CMenuProps } from "../common";
import { CLogoutOutlined, CUserOutlined } from "../common/icons";
import { useNavigate } from "react-router-dom";
import "./CurrentUser.scss";

interface ICurrentName {
  isNameHide: boolean;
}
///

const CurrentUser: React.FC<ICurrentName> = ({ isNameHide }) => {
  const auth = useAuth();
  const { profilePictureUrl, name, email } = {
    profilePictureUrl: "",
    name: "",
    email: "",
  };

  const navigate = useNavigate();

  const onClick = (path: string) => {
    navigate(path);
  };

  const items: CMenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onClick("/change-password")}
        >
          Change Password
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={() => {}}>
          Log out
        </a>
      ),
      icon: <CLogoutOutlined />,
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
            Rajitha
          </div>
        )}
      </div>
    </CDropdown>
  );
};

export default CurrentUser;
