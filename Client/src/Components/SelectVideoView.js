import check from "../media/check.png";
import remove from "../media/remove.png";
import React from 'react';
import Button from './Button';
import Header from "./Header"
import styles from './SelectVideoView.module.css'

export default function SelectVideoView(props) {
    const {
        selectVideoHandler,
        autoFindVideoHandler,
        disableVideoSelector,
        videoElementFound
    } = props;

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between' }}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <Button style={{margin: '0px 0px 10px 0px', width: "100%"}} text='Select Video' onClick={selectVideoHandler} disabled={disableVideoSelector} />
                <Button text='Auto-Select Video' onClick={autoFindVideoHandler} disabled={disableVideoSelector} />
            </div>
            <div style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center'}}>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Header>Video Found</Header>
                    <img src={videoElementFound ? check : remove} style={{ width: '32px', height: '32px'}} />
                </div>
            </div>
        </div>
    );
}
