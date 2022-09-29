import Link from "next/link";
import React from "react";

interface routeType {
  name: string;
  link: string;
}

const routes: Array<routeType> = [
  {
    name: "Todo-app",
    link: "/todo",
  },
];

function index() {
  return (
    <div className="relative h-screen w-full ">
      <div className="center">
        {routes.map((route: routeType) => (
          <Link href={route.link} passHref key={route.link}>
            <h2 className="cursor-pointer hover:text-blue-500 text-xl uppercase">
              {route.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default index;
