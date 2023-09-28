const menu = [
  {
    icon: "cart-fill",
    text: "Dashboard",
    link: "/",
  },

  {
    heading: "System Management",
  },
  {
    icon: "users-fill",
    text: "User Manage",
    active: false,
    subMenu: [
      {
        text: "Users List",
        link: "/users-list",
      },
      {
        text: "User Roles",
        link: "/user-roles",
      },
      {
        text: "User Titles",
        link: "/user-titles",
      },
    ],
  },

  {
    icon: "tile-thumb-fill",
    text: "Customers",
    active: false,
    subMenu: [
      {
        text: "Customers List",
        link: "/customers-list",
      },
    ],
  },

  {
    icon: "file-docs",
    text: "Applications",
    active: false,
    subMenu: [
      {
        text: "Personal Investments",
        link: "/individual-investments",
      },
      {
        text: "Business Investments",
        link: "/business-investments",
      },
    ],
  },
];
export default menu;
