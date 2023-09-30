import Hero from './Hero';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
const HomeScreen = () => {
  return (
    <>
      <Hero />
    </>
  );
};

export default HomeScreen;