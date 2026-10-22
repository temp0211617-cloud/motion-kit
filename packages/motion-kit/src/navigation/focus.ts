/** Native modal scope blocks background focus; wrap Tab before browser chrome takes focus. */
export function wrapDialogFocus(
  dialog: HTMLDialogElement,
  event: { key: string; shiftKey: boolean; preventDefault: () => void },
) {
  if (event.key !== "Tab") return;
  const candidates = [
    ...dialog.querySelectorAll<HTMLElement>(
      "a[href],button,input,select,textarea,summary,[tabindex],[contenteditable]",
    ),
  ].filter(
    (node) =>
      (node.tabIndex >= 0 || (node.isContentEditable && !node.hasAttribute("tabindex"))) &&
      !node.matches(":disabled") &&
      !node.closest("[inert]") &&
      getComputedStyle(node).visibility !== "hidden" &&
      node.getClientRects().length > 0,
  );
  const items = candidates.filter((node) => {
    if (!(node instanceof HTMLInputElement) || node.type !== "radio" || !node.name) return true;
    const group = candidates.filter(
      (candidate) =>
        candidate instanceof HTMLInputElement &&
        candidate.type === "radio" &&
        candidate.name === node.name &&
        candidate.form === node.form,
    );
    return (
      node === (group.find((candidate) => (candidate as HTMLInputElement).checked) ?? group[0])
    );
  });
  const active = document.activeElement;
  if (!items.length) {
    event.preventDefault();
    dialog.focus();
  } else if (!items.includes(active as HTMLElement)) {
    event.preventDefault();
    (event.shiftKey ? items.at(-1) : items[0])?.focus();
  } else if (event.shiftKey && (active === items[0] || active === dialog)) {
    event.preventDefault();
    items.at(-1)?.focus();
  } else if (!event.shiftKey && (active === items.at(-1) || active === dialog)) {
    event.preventDefault();
    items[0]?.focus();
  }
}
