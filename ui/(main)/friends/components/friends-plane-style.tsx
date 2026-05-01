export function FriendsPlaneStyle() {
  return (
    <style>
      {`
        .friend-plane-item {
          animation: friend-plane-item-enter 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: var(--friend-intro-delay);
          transform-origin: center;
        }

        @keyframes friend-plane-item-enter {
          0% {
            opacity: 0;
            filter: blur(6px);
            transform:
              translate3d(
                calc(-50% + var(--item-x) + var(--friend-intro-x)),
                calc(-50% + var(--item-y) + var(--friend-intro-y)),
                0
              )
              rotate(calc(var(--item-rotate) - 8deg))
              scale(calc(var(--item-scale) * 0.68));
          }

          68% {
            opacity: 1;
            filter: blur(0);
          }

          100% {
            opacity: 1;
            filter: blur(0);
            transform:
              translate3d(
                calc(-50% + var(--item-x)),
                calc(-50% + var(--item-y)),
                0
              )
              rotate(var(--item-rotate))
              scale(var(--item-scale));
          }
        }

        .friends-plane-stage[data-moving="true"] a,
        .friends-plane-stage[data-moving="true"] button {
          pointer-events: none;
        }

        .friends-plane-mask {
          mask-image:
            linear-gradient(to right, transparent, black 16%, black 84%, transparent),
            linear-gradient(to bottom, transparent, black 14%, black 86%, transparent);
          mask-composite: intersect;
          -webkit-mask-image:
            linear-gradient(to right, transparent, black 16%, black 84%, transparent),
            linear-gradient(to bottom, transparent, black 14%, black 86%, transparent);
          -webkit-mask-composite: source-in;
        }

        @media (prefers-reduced-motion: reduce) {
          .friend-plane-item {
            animation: none;
            opacity: 1;
          }
        }
      `}
    </style>
  )
}
