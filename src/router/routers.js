
import React from "react";
import Login from "../pages/login/login";
import Home from "../pages/home/home";
import Registration from "../pages/registration/registration";
import Room from "../pages/room/room";
import RoomResident from "../pages/RoomResident/roomResident";
import Resident from "../pages/Resident/resident";
import PublicRooms from "../pages/PublicRooms/PublicRooms";


export const private_routers = [
    {path: "/room", element:  <Room />},
    {path: "/resident/", element:  <Resident />},
    {path: "/resident_room/:id", element:  <RoomResident />},
    {path: "/public_rooms/", element:  <PublicRooms />},
    {path: "/home", element: <Home />}

]

export const public_routers = [
    {path: "/login", element:  <Login />},
    {path: "/register", element:  <Registration />}

]