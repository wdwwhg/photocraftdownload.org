// Only explicitly marked download text, links and command examples follow latest.
// Historical evidence and executable MDX imports/exports are never rewritten.
export function remarkCurrentRelease({ version }) {
  if (!/^\d+\.\d+\.\d+$/.test(version))
    throw new Error('Invalid release version');
  return (tree) => {
    const visit = (node) => {
      if (
        ['text', 'code', 'inlineCode'].includes(node.type) &&
        typeof node.value === 'string'
      )
        node.value = node.value.replaceAll('%CURRENT_VERSION%', version);
      if (
        ['link', 'image', 'definition'].includes(node.type) &&
        typeof node.url === 'string'
      )
        node.url = node.url.replaceAll('%CURRENT_VERSION%', version);
      for (const child of node.children ?? []) visit(child);
    };
    visit(tree);
  };
}
