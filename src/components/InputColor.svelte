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
  import InputRadio from "./InputRadio.svelte";
  import ColorDropdown from "./ColorDropdown.svelte";
  import ColorInteger from "./ColorInteger.svelte";

  // TS / Logic
  import { Tiles, ColorModes } from "../ts/defs";
  import InputSeparator from "./InputSeparator.svelte";

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
  <InputRadio
    on:update={dispatchUpdate}
    bind:value={$PatternStore.color[scope].mode}
    items={[...ColorModes]}
    labels={$TextStore.color_modes}
  />
</InputItem>

<InputSeparator />

<!-- If colormode is tile, we set color for each tile -->
<div class="mt-2">
  {#if $PatternStore.color[scope].mode == "tile"}
    {#each Tiles as t}
      <ColorDropdown
        label={$TextStore.tiles[t]}
        bind:color={$PatternStore.color[scope].tile[t]}
        on:update={dispatchUpdate}
      />
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
  .mt-2 {
    margin-top: var(--aria);
  }
</style>
