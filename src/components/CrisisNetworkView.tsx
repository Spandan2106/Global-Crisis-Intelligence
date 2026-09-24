import React, { useState } from 'react';
import { CRISIS_NETWORK_NODES, CRISIS_NETWORK_EDGES } from '../data/networkGraph';
import { NetworkNode } from '../types/crisis';
import { Network, AlertCircle, ArrowRight, Info, CheckCircle2 } from 'lucide-react';

export const CrisisNetworkView: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-conflict');

  const selectedNode = CRISIS_NETWORK_NODES.find(n => n.id === selectedNodeId) || CRISIS_NETWORK_NODES[0];

  // Connected edges and nodes
  const outgoingEdges = CRISIS_NETWORK_EDGES.filter(e => e.source === selectedNodeId);
  const incomingEdges = CRISIS_NETWORK_EDGES.filter(e => e.target === selectedNodeId);

  // Layout node coordinates for visualization
  const nodePositions: Record<string, { x: number; y: number }> = {
    'node-conflict': { x: 120, y: 150 },
    'node-maritime-chokepoint': { x: 300, y: 90 },
    'node-humanitarian-strain': { x: 300, y: 250 },
    'node-fertilizer-food': { x: 320, y: 390 },
    'node-freight-rates': { x: 480, y: 70 },
    'node-oil-supply': { x: 480, y: 160 },
    'node-energy-prices': { x: 650, y: 140 },
    'node-inflation-shock': { x: 670, y: 270 },
    'node-currency-pressure': { x: 860, y: 210 },
    'node-central-bank': { x: 860, y: 330 },
    'node-market-volatility': { x: 1040, y: 230 },
  };

  return (
    <div className="w-full h-full bg-slate-950 p-4 sm:p-6 overflow-y-auto font-mono text-slate-200">
      {/* Notice & Disclaimer Header */}
      <div className="mb-4 p-3 bg-cyan-950/30 border border-cyan-800/80 rounded-xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-cyan-300">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>Analytical Transmission Model:</strong> Nodes represent systemic stress points. Edges represent analytical relationships and potential propagation channels rather than proven linear causation.
          </span>
        </div>
        <span className="text-[10px] text-cyan-400 font-bold hidden md:inline">
          INTER-SYSTEMIC CORRELATION
        </span>
      </div>

      {/* Main Interactive Graph & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Graph Canvas */}
        <div className="lg:col-span-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl relative overflow-x-auto min-h-[520px]">
          <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" />
              Crisis Transmission Network Graph
            </span>
            <span className="text-[10px]">Click any node to inspect transmission mechanics</span>
          </div>

          <svg viewBox="0 0 1150 480" className="w-full min-w-[900px] h-[450px]">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
              </marker>
              <marker id="arrow-dim" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
              </marker>
            </defs>

            {/* Edges */}
            {CRISIS_NETWORK_EDGES.map((edge) => {
              const src = nodePositions[edge.source];
              const tgt = nodePositions[edge.target];
              if (!src || !tgt) return null;

              const isConnected = edge.source === selectedNodeId || edge.target === selectedNodeId;

              return (
                <g key={edge.id}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isConnected ? '#38bdf8' : '#1e293b'}
                    strokeWidth={isConnected ? 2.5 : 1.2}
                    strokeDasharray={isConnected ? 'none' : '4 4'}
                    markerEnd={isConnected ? 'url(#arrow)' : 'url(#arrow-dim)'}
                    className="transition-all duration-300"
                  />
                  {isConnected && (
                    <text
                      x={(src.x + tgt.x) / 2}
                      y={(src.y + tgt.y) / 2 - 8}
                      fill="#94a3b8"
                      fontSize="9"
                      textAnchor="middle"
                      className="font-mono bg-slate-950"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {CRISIS_NETWORK_NODES.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;
              const isSelected = selectedNodeId === node.id;
              const isDirectlyConnected = outgoingEdges.some(e => e.target === node.id) || incomingEdges.some(e => e.source === node.id);

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer group"
                >
                  <circle
                    r={isSelected ? 26 : 20}
                    className={`transition-all duration-200 ${
                      isSelected
                        ? 'fill-cyan-500 stroke-cyan-200 stroke-2 drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]'
                        : isDirectlyConnected
                        ? 'fill-slate-800 stroke-cyan-500/80 stroke-2'
                        : 'fill-slate-900 stroke-slate-700 stroke-1'
                    }`}
                  />
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill={isSelected ? '#020617' : '#e2e8f0'}
                    fontSize={isSelected ? '11' : '10'}
                    fontWeight="bold"
                    className="pointer-events-none select-none font-mono"
                  >
                    {node.riskIndicator.toFixed(2)}
                  </text>
                  <text
                    textAnchor="middle"
                    dy={isSelected ? 42 : 36}
                    fill={isSelected ? '#38bdf8' : '#94a3b8'}
                    fontSize="10"
                    fontWeight="600"
                    className="pointer-events-none select-none font-sans"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Transmission Channel Inspector */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Node Analysis
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                Risk: {selectedNode.riskIndicator.toFixed(2)}
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-100 mb-1">
              {selectedNode.label}
            </h3>
            {selectedNode.country && (
              <div className="text-[11px] text-cyan-400 mb-2">
                Epicenter: {selectedNode.country}
              </div>
            )}
            <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
              {selectedNode.description}
            </p>

            {/* Outgoing Transmission Channels */}
            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                  Propagates Stress To ({outgoingEdges.length}):
                </span>
                {outgoingEdges.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic">No downstream transmission channels configured.</p>
                ) : (
                  <ul className="space-y-1.5 text-xs">
                    {outgoingEdges.map((edge) => {
                      const target = CRISIS_NETWORK_NODES.find(n => n.id === edge.target);
                      return (
                        <li key={edge.id} className="p-2 bg-slate-950/60 border border-slate-800/80 rounded-lg">
                          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-0.5">
                            <ArrowRight className="w-3 h-3" />
                            <span>{target?.label}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-sans">{edge.label}</p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Incoming Propagation Drivers */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                  Triggered By Upstream ({incomingEdges.length}):
                </span>
                {incomingEdges.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic">Primary root flashpoint / external initiator.</p>
                ) : (
                  <ul className="space-y-1.5 text-xs">
                    {incomingEdges.map((edge) => {
                      const src = CRISIS_NETWORK_NODES.find(n => n.id === edge.source);
                      return (
                        <li key={edge.id} className="p-2 bg-slate-950/60 border border-slate-800/80 rounded-lg">
                          <div className="text-slate-300 font-semibold mb-0.5">
                            From: {src?.label}
                          </div>
                          <p className="text-[11px] text-slate-400 font-sans">{edge.label}</p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 italic">
            Transmission parameters updated continuously based on global supply elasticity and central-bank reaction functions.
          </div>
        </div>
      </div>
    </div>
  );
};
