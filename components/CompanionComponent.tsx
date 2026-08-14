'use client';

import {useEffect, useRef, useState} from 'react'
import {cn, configureAssistant, getSubjectColor} from "@/lib/utils";
import {vapi} from "@/lib/vapi.sdk";
import Image from "next/image";
import Lottie, {LottieRefCurrentProps} from "lottie-react";
import soundwaves from '@/constants/soundwaves.json'
import {addToSessionHistory} from "@/lib/actions/companion.actions";

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

const CompanionComponent = ({ companionId, subject, topic, name, userName, userImage, style, voice }: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [messages, setMessages] = useState<SavedMessage[]>([]);

    const lottieRef = useRef<LottieRefCurrentProps>(null);

    useEffect(() => {
        if(lottieRef) {
            if(isSpeaking) {
                lottieRef.current?.play()
            } else {
                lottieRef.current?.stop()
            }
        }
    }, [isSpeaking, lottieRef])

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
            addToSessionHistory(companionId)
        }

        const onMessage = (message: Message) => {
            if(message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage= { role: message.role, content: message.transcript}
                setMessages((prev) => [newMessage, ...prev])
            }
        }

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        const onError = (error: Error) => console.log('Error', error);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('error', onError);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('error', onError);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
        }
    }, []);

    const toggleMicrophone = () => {
        const isMuted = vapi.isMuted();
        vapi.setMuted(!isMuted);
        setIsMuted(!isMuted)
    }

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING)

        const assistantOverrides = {
            variableValues: { subject, topic, style },
            clientMessages: ["transcript"],
            serverMessages: [],
        }

        // @ts-expect-error
        vapi.start(configureAssistant(voice, style), assistantOverrides)
    }

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED)
        vapi.stop()
    }

    return (
        <section className="flex flex-col gap-6 w-full">
            {/* Bagian Utama: Kartu Kiri (AI) & Kartu Kanan (User & Kontrol) */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
                
                {/* Kotak Kiri: AI Companion (Lebar 2 Kolom) */}
                <div className="companion-section lg:col-span-2 flex flex-col items-center justify-center p-10 min-h-[350px] relative w-full">
                    <div className="relative flex items-center justify-center w-40 h-40 rounded-2xl mb-4" style={{ backgroundColor: getSubjectColor(subject)}}>
                        <div
                            className={
                            cn(
                                'absolute inset-0 flex items-center justify-center transition-opacity duration-1000', 
                                callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-100' : 'opacity-0', 
                                callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse'
                            )
                        }>
                            <Image src={`/icons/${subject}.svg`} alt={subject} width={100} height={100} />
                        </div>

                        <div className={cn('absolute inset-0 flex items-center justify-center transition-opacity duration-1000', callStatus === CallStatus.ACTIVE ? 'opacity-100': 'opacity-0')}>
                            <Lottie
                                lottieRef={lottieRef}
                                animationData={soundwaves}
                                autoplay={false}
                                className="w-32 h-32"
                            />
                        </div>
                    </div>
                    <p className="font-bold text-2xl text-center">{name}</p>
                </div>

                {/* Kotak Kanan: Profil User & Tombol Kontrol (Lebar 1 Kolom) */}
                <div className="flex flex-col gap-4 w-full">
                    <div className="user-section flex flex-col items-center justify-center p-6 w-full">
                        <Image src={userImage} alt={userName} width={90} height={90} className="rounded-xl object-cover mb-2" />
                        <p className="font-bold text-lg text-center">
                            {userName}
                        </p>
                    </div>

                    <button className="btn-mic w-full justify-center py-3 flex items-center gap-2 bg-card border rounded-xl shadow-sm" onClick={toggleMicrophone} disabled={callStatus !== CallStatus.ACTIVE}>
                        <Image src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'} alt="mic" width={22} height={22} />
                        <span className="text-sm font-medium">
                            {isMuted ? 'Turn on microphone' : 'Turn off microphone'}
                        </span>
                    </button>

                    <button 
                        className={cn(
                            'rounded-xl py-3.5 cursor-pointer transition-colors w-full text-white font-semibold flex justify-center items-center shadow-md', 
                            callStatus === CallStatus.ACTIVE ? 'bg-red-600 hover:bg-red-700' : 'bg-[#DA674A] hover:bg-[#c55a3f]', 
                            callStatus === CallStatus.CONNECTING && 'animate-pulse'
                        )} 
                        onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
                    >
                        {callStatus === CallStatus.ACTIVE
                        ? "End Session"
                        : callStatus === CallStatus.CONNECTING
                            ? 'Connecting...'
                            : 'Start Session'
                        }
                    </button>
                </div>
            </section>

            {/* Bagian Bawah: Transkrip Percakapan */}
            <section className="transcript w-full relative mt-2 bg-card border rounded-2xl p-4 shadow-sm">
                <div className="transcript-message no-scrollbar max-h-48 overflow-y-auto space-y-2">
                    {messages.length === 0 ? (
                        <p className="text-muted-foreground text-center text-sm py-4">Transcript will appear here once the session starts...</p>
                    ) : (
                        messages.map((message, index) => {
                            if(message.role === 'assistant') {
                                return (
                                    <p key={index} className="text-sm">
                                        <span className="font-bold">{name.split(' ')[0]}</span>: {message.content}
                                    </p>
                                )
                            } else {
                                return <p key={index} className="text-primary text-sm font-medium">
                                    <span className="font-bold">{userName}</span>: {message.content}
                                </p>
                            }
                        })
                    )}
                </div>
                <div className="transcript-fade" />
            </section>
        </section>
    )
}

export default CompanionComponent;