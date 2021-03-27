<script lang="ts">
  /**
   * Imports
   */

  import { DefaultColorsStore, PatternStore, TextStore } from "../stores";
  import { createEventDispatcher } from "svelte";

  // Modules
  import { nanoid } from "nanoid";

  // Svelte
  import InputItem from "./InputItem.svelte";
  import ColorDropdown from "./ColorDropdown.svelte";
  import ColorInteger from "./ColorInteger.svelte";

  // TS / Logic
  import { Tiles, ColorModes } from "../ts/defs";

  /**
   * Parameters
   */

  export let scope: string;

  /**
   * Logic
   */

  // Dispatch function
  const dispatch = createEventDispatcher();
  function dispatchUpdate() {
    dispatch("update");
  }

  // IDs for select
  const ids = {
    line: nanoid(5),
    wave: nanoid(5),
    peak: nanoid(5),
  };
</script>

<!-- Radio buttons to select the color mode -->
<InputItem>
  {#each ColorModes as cm}
    <label class="radio__label">
      <input
        type="radio"
        on:change={dispatchUpdate}
        bind:group={$PatternStore.color[scope].mode}
        value={cm}
      />
      {$TextStore.color_modes[cm]}
    </label>
  {/each}
</InputItem>

<!-- If colormode is tile, we set color for each tile -->
<div class="mt-2">
  {#if $PatternStore.color[scope].mode == "tile"}
    {#each Tiles as t}
      <InputItem>
        <label for={ids[t]}>{$TextStore.tiles[t]}</label>
        <ColorDropdown
          bind:color={$PatternStore.color[scope].tile[t]}
          on:update={dispatchUpdate}
        />
      </InputItem>
    {/each}
    <!-- If colormode is distribution, for each color we specify its distribution -->
  {:else if $PatternStore.color[scope].mode == "distribution"}
    {#each $DefaultColorsStore as color}
      <InputItem>
        <ColorInteger
          {color}
          on:update={dispatchUpdate}
          bind:value={$PatternStore.color[scope].distribution[color]}
        />
      </InputItem>
    {/each}
  {/if}
</div>

<style>
  .radio {
    display: flex;
    flex-flow: row nowrap;
  }

  input[type="radio"] {
    margin-right: calc(var(--aria) / 2);
  }

  .radio__label {
    margin-bottom: calc(var(--aria) / 2);
    display: flex;
    flex-flow: row-reverse nowrap;
    justify-content: space-between;
    align-items: center;
    min-height: var(--input-h);
    background-color: var(--cds-ui-02);
    border-radius: var(--round-s);
    padding: 5px 10px;
  }

  .radio__label:hover {
    background-color: var(--cds-ui-03);
  }

  label:last-child {
    margin-bottom: 0;
  }

  .mt-2 {
    margin-top: var(--aria);
  }
</style>
