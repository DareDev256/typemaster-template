"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  getApiKey,
  saveApiKey,
  removeApiKey,
  validateApiKey,
} from "@/lib/openai";

type ConnectionStatus = "idle" | "testing" | "connected" | "invalid";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [showKey, setShowKey] = useState(false);

  // Load existing key on mount
  useEffect(() => {
    const existingKey = getApiKey();
    if (existingKey) {
      setApiKey(existingKey);
      setStatus("connected");
    }
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      removeApiKey();
      setStatus("idle");
      return;
    }

    setStatus("testing");

    const isValid = await validateApiKey(apiKey.trim());

    if (isValid) {
      saveApiKey(apiKey.trim());
      setStatus("connected");
    } else {
      setStatus("invalid");
    }
  };

  const handleClear = () => {
    removeApiKey();
    setApiKey("");
    setStatus("idle");
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/">
          <Button variant="secondary" size="sm">
            ← BACK
          </Button>
        </Link>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-pixel text-lg md:text-2xl text-arcade-neon-cyan"
        >
          ⚙️ SETTINGS
        </motion.h1>
        <div className="w-16" />
      </div>

      {/* Settings content */}
      <div className="max-w-xl mx-auto">
        {/* OpenAI API Key Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-arcade-dark p-6 mb-6"
        >
          <h2 className="font-pixel text-sm text-arcade-neon-green mb-4">
            🤖 OPENAI API KEY
          </h2>

          <p className="font-pixel text-[10px] text-gray-400 mb-4">
            Enter your OpenAI API key to enable AI Challenge mode. Your key is
            stored locally in your browser and only sent to OpenAI.
          </p>

          {/* API Key Input */}
          <div className="relative mb-4">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setStatus("idle");
              }}
              placeholder="sk-..."
              className="w-full bg-arcade-dark border border-gray-700 p-3 font-mono text-sm text-white focus:border-arcade-neon-cyan focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 font-pixel text-[10px] text-gray-500 hover:text-arcade-neon-cyan"
            >
              {showKey ? "HIDE" : "SHOW"}
            </button>
          </div>

          {/* Status */}
          <div className="mb-4">
            {status === "testing" && (
              <motion.p
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="font-pixel text-[10px] text-arcade-neon-yellow"
              >
                Testing connection...
              </motion.p>
            )}
            {status === "connected" && (
              <p className="font-pixel text-[10px] text-arcade-neon-green">
                ✓ Connected to OpenAI
              </p>
            )}
            {status === "invalid" && (
              <p className="font-pixel text-[10px] text-arcade-error">
                ✗ Invalid API key
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={status === "testing"}
              size="sm"
            >
              {status === "testing" ? "TESTING..." : "SAVE & TEST"}
            </Button>
            {apiKey && (
              <Button onClick={handleClear} variant="secondary" size="sm">
                CLEAR
              </Button>
            )}
          </div>
        </motion.div>

        {/* Get API Key Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border border-arcade-dark p-6"
        >
          <h2 className="font-pixel text-sm text-arcade-neon-magenta mb-4">
            📚 HOW TO GET AN API KEY
          </h2>

          <ol className="font-pixel text-[10px] text-gray-400 space-y-2 list-decimal list-inside">
            <li>
              Go to{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-arcade-neon-cyan hover:underline"
              >
                platform.openai.com/api-keys
              </a>
            </li>
            <li>Sign in or create an OpenAI account</li>
            <li>Click &quot;Create new secret key&quot;</li>
            <li>Copy the key and paste it above</li>
          </ol>

          <p className="font-pixel text-[8px] text-gray-600 mt-4">
            Note: OpenAI charges for API usage. The AI Challenge mode uses
            gpt-4o-mini which is very affordable (~$0.001 per question).
          </p>
        </motion.div>

        {/* Security Notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-pixel text-[8px] text-gray-600 mt-6 text-center"
        >
          🔒 Your API key is stored only in your browser&apos;s localStorage.
          <br />
          It is never sent to any server except OpenAI directly.
        </motion.p>
      </div>
    </div>
  );
}
