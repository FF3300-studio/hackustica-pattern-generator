<div>
  <slot />
</div>

<style>
  div {
    margin-bottom: calc(var(--aria) / 2);
  }
  div:last-child {
    margin-bottom: 0;
  }
</style>
