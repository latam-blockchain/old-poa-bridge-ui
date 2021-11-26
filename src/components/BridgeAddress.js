import React from "react";

export const BridgeAddress = ({ isHome, reverse }) => {
  const getAddress = () =>
    isHome ? (
      <div className="home-address-container" />
    ) : (
      <div className="foreign-address-container" />
    );

  return isHome ? (
    <div className="bridge-home">
      <div className="bridge-home-container">
        <div className="home-logo-container">
          {reverse ? (
            <div>
              <h3>Rinkeby</h3>
            </div>
          ) : (
            <div className="home-logo"></div>
          )}
          {/* <div className={reverse ? "foreign-logo" : "home-logo"} /> */}
        </div>
      </div>
      {getAddress()}
    </div>
  ) : (
    <div className="bridge-foreign">
      {getAddress()}
      <div className="bridge-foreign-container">
        <div className="foreign-logo-container">
          {reverse ? (
            <div className="home-logo"></div>
          ) : (
            <div>
              <h3>Rinkeby</h3>
            </div>
          )}
          {/* <div className={reverse ? "home-logo" : "foreign-logo"} /> */}
        </div>
      </div>
    </div>
  );
};
