"use client";
import { Rail, type RailProps } from "./Rail";
import { NativeRail } from "./NativeRail";
export type { RailProps } from "./Rail";
export function MediaRail(props: RailProps) {
  return <NativeRail {...props} />;
}
export function DragCarousel(props: RailProps) {
  return <Rail {...props} kind="drag" />;
}
export function MomentumCarousel(props: RailProps) {
  return <Rail {...props} kind="momentum" />;
}
export function InfiniteCarousel(props: RailProps) {
  return <Rail {...props} kind="infinite" />;
}
export function SnapCarousel(props: RailProps) {
  return <Rail {...props} kind="snap" />;
}
export function FilmRail(props: RailProps & { snap?: boolean; edgeFade?: boolean }) {
  return <Rail {...props} kind="film" />;
}
