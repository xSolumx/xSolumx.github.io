#!/usr/bin/env python3
"""
Skill Tree Connection Validator
Ensures all nodes exist and connections make logical sense
"""

import re
import json
from collections import defaultdict

# Read the skill-tree-data.js file
with open('skill-tree-data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all node IDs from node definitions
node_pattern = r'id:\s*"([a-z0-9-]+)"'
all_ids_raw = re.findall(node_pattern, content)
all_node_ids = sorted(list(set(all_ids_raw)))

# Filter to only get node IDs (not group IDs)
# Group IDs: languages, web, backend, database, devops, monitoring, design, ai, tools, cloud, automation
group_ids = {'languages', 'web', 'backend', 'database', 'devops', 'monitoring', 'design', 'ai', 'tools', 'cloud', 'automation'}
node_ids = [nid for nid in all_node_ids if nid not in group_ids]

print("=" * 70)
print("SKILL TREE VALIDATION REPORT")
print("=" * 70)
print(f"\nTotal unique node IDs found: {len(node_ids)}")
print(f"Total unique IDs (including groups): {len(all_node_ids)}")

# Group nodes by category
nodes_by_category = defaultdict(list)
for nid in node_ids:
    category = nid.rsplit('-', 1)[0]
    nodes_by_category[category].append(nid)

print("\nNodes by category:")
for category in sorted(nodes_by_category.keys()):
    nodes = sorted(nodes_by_category[category])
    print(f"  {category}: {len(nodes)} nodes → {', '.join(nodes)}")

# Extract all connections
connection_pattern = r'\{\s*from:\s*"([a-z0-9-]+)",\s*to:\s*"([a-z0-9-]+)"'
connections = re.findall(connection_pattern, content)
unique_connections = set(connections)

print(f"\nTotal connections: {len(connections)}")
print(f"Unique connections: {len(unique_connections)}")

# Find invalid connections (referencing non-existent nodes)
invalid_from = []
invalid_to = []

for from_node, to_node in unique_connections:
    if from_node not in node_ids and from_node not in group_ids:
        invalid_from.append(from_node)
    if to_node not in node_ids and to_node not in group_ids:
        invalid_to.append(to_node)

invalid_from = list(set(invalid_from))
invalid_to = list(set(invalid_to))

if invalid_from or invalid_to:
    print("\n⚠️ INVALID CONNECTIONS FOUND:")
    if invalid_from:
        print(f"  Invalid FROM nodes: {sorted(invalid_from)}")
    if invalid_to:
        print(f"  Invalid TO nodes: {sorted(invalid_to)}")
else:
    print("\n✓ All connections reference valid nodes")

# Find orphaned nodes (nodes with no connections)
nodes_with_connections = set()
for from_node, to_node in unique_connections:
    nodes_with_connections.add(from_node)
    nodes_with_connections.add(to_node)

orphaned_nodes = [nid for nid in node_ids if nid not in nodes_with_connections]
if orphaned_nodes:
    print(f"\n⚠️ ORPHANED NODES (no connections): {len(orphaned_nodes)}")
    print(f"  {sorted(orphaned_nodes)}")
else:
    print("\n✓ No orphaned nodes found")

# Find missing nodes referenced in connections
missing_nodes = []
for from_node, to_node in unique_connections:
    if from_node in node_ids and from_node not in all_ids_raw[all_ids_raw.index(from_node):]:
        missing_nodes.append(from_node)
    if to_node in node_ids and to_node not in all_ids_raw[all_ids_raw.index(to_node):]:
        missing_nodes.append(to_node)

# Better approach: Extract all defined nodes from the nodes array
defined_nodes_pattern = r'id:\s*"([a-z0-9-]+)",\s*\n\s*title:'
defined_nodes = re.findall(defined_nodes_pattern, content)
print(f"\nDefined nodes (with title): {len(defined_nodes)}")

# Find connections to undefined nodes
undefined_in_connections = []
for from_node, to_node in unique_connections:
    if from_node not in defined_nodes and from_node not in group_ids:
        undefined_in_connections.append(from_node)
    if to_node not in defined_nodes and to_node not in group_ids:
        undefined_in_connections.append(to_node)

undefined_in_connections = sorted(list(set(undefined_in_connections)))
if undefined_in_connections:
    print(f"\n⚠️ NODES IN CONNECTIONS BUT NOT DEFINED: {len(undefined_in_connections)}")
    for node in undefined_in_connections:
        # Find connections involving this node
        involving = [(f, t) for f, t in unique_connections if f == node or t == node]
        print(f"  {node}: {len(involving)} connections")
        for f, t in involving[:3]:
            print(f"    {f} → {t}")
        if len(involving) > 3:
            print(f"    ... and {len(involving) - 3} more")
else:
    print("\n✓ All connected nodes are properly defined")

print("\n" + "=" * 70)
