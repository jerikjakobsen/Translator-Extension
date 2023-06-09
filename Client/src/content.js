/*global chrome*/
/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import AppController from "./AppController";
import Settings from './Settings';
import {
  RouterProvider,
  createMemoryRouter,
} from "react-router-dom";

class Main extends React.Component {
    render() {
        let doc = document;
        return (
            <Frame head={[<link type="text/css" rel="stylesheet" href={chrome.runtime.getURL("/static/css/content.css")} ></link>]}> 
               <FrameContextConsumer>
               {
                  ({document, window}) => {
                    const routes = [
                      {
                        path: "/",
                        element: <AppController document={document} window={window} chrome={chrome} outerDocument={doc} isExt={true}/>
                      },
                      {
                        path: "/settings",
                        element: <Settings />
                      }
                    ];
                    const router = createMemoryRouter(routes, {
                      initialEntries: ["/"],
                      initialIndex: 1,
                    });
                    return (
                      <RouterProvider router={router} />
                    )
                  }
                }
                </FrameContextConsumer>
            </Frame>
        )
    }
}

const app = document.createElement('div');
app.id = "my-extension-root";

document.body.appendChild(app);
ReactDOM.render(<Main />, app);
app.style.display = "none";
chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
      if(request.message === "clicked_browser_action") {
        toggle();
      }
   }
);

function toggle(){
   if(app.style.display === "none"){
     app.style.display = "block";
   }else{
     app.style.display = "none";
   }
}