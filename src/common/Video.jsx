import React, {useEffect, useState} from "react";
import liveClassesService from "../services/live-classes.service";
import authenticationService from "../services/authentication.service";
import {useNavigate, useSearchParams} from "react-router-dom";
import {JaaSMeeting} from '@jitsi/react-sdk';
import {message, Spin} from "antd";

const Video = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const meetingId = searchParams.get('meetingId')
    const [loading, setLoading] = useState(true);
    const [jwt, setJwt] = useState('');
    const userRole = authenticationService.getUserRole();
    const navigate = useNavigate();


    const fetchToken = async () => {
        try {
            const response = await liveClassesService.getToken({
                meeting_id: searchParams.get('meetingId')
            })
            setJwt(response.data['token']);
            setLoading(false);
        } catch (e) {
            if (userRole === 'STUDENT') navigate('/student/live-classes');
            else if (userRole === 'TEACHER') navigate('/teacher/live-classes');
            else if (userRole === 'ADMIN') navigate('/admin/live-classes');
        }
    }

    if (!meetingId) {
        if (userRole === 'STUDENT') navigate('/student/live-classes');
        else if (userRole === 'TEACHER') navigate('/teacher/live-classes');
        else if (userRole === 'ADMIN') navigate('/admin/live-classes');
    }

    useEffect(() => {
        fetchToken();
    }, [])

    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center vh-100 flex-column'>
                <Spin
                    size={"large"}
                />
                <p>Loading</p>
            </div>
        )
    }

    const handleJaaSIFrameRef = iframeRef => {
        iframeRef.style.background = '#3d3d3d';
        iframeRef.style.height = '100vh';
    };

    const handleClose = () => {
        message.info('Exiting from the meeting');
        if (userRole === 'STUDENT') navigate('/student/live-classes');
        else if (userRole === 'TEACHER') navigate('/teacher/live-classes');
        else if (userRole === 'ADMIN') navigate('/admin/live-classes');
    }

    const Spinner = () => <div className='d-flex justify-content-center align-items-center vh-100 flex-column'>
        <Spin
            size={"large"}
        />
        <p>Loading</p>
    </div>

    return <JaaSMeeting
        roomName={meetingId}
        appId={"vpaas-magic-cookie-02f5d8e8bcfa452fa375efc17263d556"}
        jwt={jwt}
        useStaging={false}
        getIFrameRef={handleJaaSIFrameRef}
        spinner={Spinner}
        onReadyToClose={handleClose}
        configOverwrite = {{
            hiddenPremeetingButtons: ['invite'],
            toolbarButtons: [
               'camera',
               'chat',
               'closedcaptions',
               'desktop',
               'download',
               'embedmeeting',
               'etherpad',
               'feedback',
               'filmstrip',
               'fullscreen',
               'hangup',
               'help',
               'highlight',
               'microphone',
               'noisesuppression',
               'participants-pane',
               'profile',
               'raisehand',
               'security',
               'select-background',
               'settings',
               'shortcuts',
               'stats',
               'tileview',
               'toggle-camera',
               'videoquality',
               'whiteboard',
            ],
        }}
    />
}

export default Video;