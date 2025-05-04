import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  ChevronDown,
  PhoneIcon,
  MicIcon,
  MicOffIcon,
  Volume2Icon,
  VolumeOffIcon,
} from 'lucide-react';
import { EchoPilot } from '@echopilot/web-sdk';

interface ControlsProps {
  agent: EchoPilot;
  isConnected: boolean;
  isLoading: boolean;
  onStartCall: () => void;
  onStopCall: () => void;
  disabled: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  agent,
  isConnected,
  isLoading,
  onStartCall,
  onStopCall,
  disabled,
}) => {
  const [audioDevices, setAudioDevices] = useState<{
    inputs: MediaDeviceInfo[];
    outputs: MediaDeviceInfo[];
  }>({ inputs: [], outputs: [] });

  const [selectedInput, setSelectedInput] = useState<string>('');
  const [selectedOutput, setSelectedOutput] = useState<string>('');

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);

  const onToggleMute = () => {
    setIsMuted(!isMuted);
    agent.setMuted(!isMuted);
  };

  const onToggleSpeaker = () => {
    setIsSpeakerMuted(!isSpeakerMuted);
    agent.setSpeakerMuted(!isSpeakerMuted);
  };

  useEffect(() => {
    if (!agent || !isConnected) return;
    agent.getAudioDevices().then((devices) => {
      setAudioDevices({
        inputs: devices.inputs as MediaDeviceInfo[],
        outputs: devices.outputs as MediaDeviceInfo[],
      });
    });
  }, [agent, isConnected]);

  const onInputSelect = (deviceId: string) => {
    setSelectedInput(deviceId);
    agent.setInputDevice(deviceId);
  };

  const onOutputSelect = (deviceId: string) => {
    setSelectedOutput(deviceId);
    agent.setOutputDevice(deviceId);
  };

  const selectedOutputDevice = audioDevices.outputs.find(
    (device) => device.deviceId === selectedOutput
  );

  const selectedInputDevice = audioDevices.inputs.find(
    (device) => device.deviceId === selectedInput
  );

  return (
    <div className='fixed bottom-0 left-0 right-0 backdrop-blur-lg p-6'>
      <div className='max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-center gap-2'>
        {isLoading ? (
          // show a call loading animation
          <div className='flex items-center gap-2'>
            <div className='w-5 h-5 bg-slate-300 rounded-full animate-pulse' />
            <div className='w-5 h-5 bg-slate-300 rounded-full animate-pulse' />
            <div className='w-5 h-5 bg-slate-300 rounded-full animate-pulse' />
          </div>
        ) : !isConnected ? (
          <motion.button
            onClick={onStartCall}
            className='btn-call flex items-center gap-2 font-medium transition-colors'
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            disabled={disabled}
          >
            <PhoneIcon className='w-5 h-5' />
            Start Call
          </motion.button>
        ) : (
          <AnimatePresence mode='popLayout'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className='flex items-center gap-2'
            >
              <motion.button
                onClick={onStopCall}
                className='bg-red-500/20 text-red-400 hover:bg-red-500/30 p-3 rounded-full transition-colors'
                whileHover={{ scale: disabled ? 1 : 1.05 }}
                whileTap={{ scale: disabled ? 1 : 0.95 }}
                disabled={disabled}
              >
                <PhoneIcon className='w-5 h-5' />
              </motion.button>
              <div className='relative'>
                <motion.button
                  onClick={onToggleMute}
                  className={`p-3 rounded-full transition-colors ${
                    isMuted
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  whileHover={{ scale: disabled ? 1 : 1.05 }}
                  whileTap={{ scale: disabled ? 1 : 0.95 }}
                  disabled={disabled}
                >
                  {isMuted ? (
                    <MicOffIcon className='w-5 h-5' />
                  ) : (
                    <MicIcon className='w-5 h-5' />
                  )}
                </motion.button>
                <Popover>
                  <PopoverTrigger asChild>
                    <motion.button
                      className='absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center hover:bg-slate-600'
                      whileHover={{ scale: disabled ? 1 : 1.1 }}
                      whileTap={{ scale: disabled ? 1 : 0.9 }}
                      disabled={disabled}
                    >
                      <ChevronDown className='w-3 h-3 text-slate-300' />
                    </motion.button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-72 p-0 bg-slate-800 border-slate-700'
                    align='end'
                  >
                    <div className='p-3 border-b border-slate-700'>
                      <div className='text-sm font-medium text-slate-300'>
                        Select Microphone
                      </div>
                      <div className='text-xs text-slate-400'>
                        {selectedInputDevice?.label || 'Default Microphone'}
                      </div>
                    </div>
                    <div className='py-2'>
                      {audioDevices.inputs.map((device) => (
                        <button
                          key={device.deviceId}
                          onClick={() => onInputSelect(device.deviceId)}
                          className={`w-full px-4 py-2 text-left text-sm transition-colors duration-200 ${
                            device.deviceId === selectedInput
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {device.label || `Microphone ${device.deviceId}`}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className='relative'>
                <motion.button
                  onClick={onToggleSpeaker}
                  className={`p-3 rounded-full transition-colors ${
                    isSpeakerMuted
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  whileHover={{ scale: disabled ? 1 : 1.05 }}
                  whileTap={{ scale: disabled ? 1 : 0.95 }}
                  disabled={disabled}
                >
                  {isSpeakerMuted ? (
                    <VolumeOffIcon className='w-5 h-5' />
                  ) : (
                    <Volume2Icon className='w-5 h-5' />
                  )}
                </motion.button>
                <Popover>
                  <PopoverTrigger asChild>
                    <motion.button
                      className='absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center hover:bg-slate-600'
                      whileHover={{ scale: disabled ? 1 : 1.1 }}
                      whileTap={{ scale: disabled ? 1 : 0.9 }}
                      disabled={disabled}
                    >
                      <ChevronDown className='w-3 h-3 text-slate-300' />
                    </motion.button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-72 p-0 bg-slate-800 border-slate-700'
                    align='end'
                  >
                    <div className='p-3 border-b border-slate-700'>
                      <div className='text-sm font-medium text-slate-300'>
                        Select Speaker
                      </div>
                      <div className='text-xs text-slate-400'>
                        {selectedOutputDevice?.label || 'Default Speaker'}
                      </div>
                    </div>
                    <div className='py-2'>
                      {audioDevices.outputs.map((device) => (
                        <button
                          key={device.deviceId}
                          onClick={() => onOutputSelect(device.deviceId)}
                          className={`w-full px-4 py-2 text-left text-sm transition-colors duration-200 ${
                            device.deviceId === selectedOutput
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {device.label || `Speaker ${device.deviceId}`}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Controls;
