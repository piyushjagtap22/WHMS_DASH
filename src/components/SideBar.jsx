import React from "react";
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme,
} from "@mui/material";
import {
    SettingsOutlined,
    ChevronLeft,
    ChevronRightOutlined,
    HomeOutlined,
    ShoppingCartOutlined,
    Groups2Outlined,
    ReceiptLongOutlined,
    PublicOutlined,
    PointOfSaleOutlined,
    TodayOutlined,
    CalendarMonthOutlined,
    AdminPanelSettingsOutlined,
    TrendingUpOutlined,
    PieChartOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";

const Sidebar = ({
    drawerWidth,
    isSideBarOpen,
    setIsSideBarOpen,
    isNonMobile,
}) => {
    const { pathname } = useLocation();
    const [active, setActive] = useState("");
    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        setActive(pathname.substring(1));
    }, [pathname])

    return (
        <></>
    )
};

export default Sidebar;
