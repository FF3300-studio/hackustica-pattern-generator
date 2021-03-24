<script lang="ts">
  /* --- Imports --- */

  // Svelte
  import InputItem from "./InputItem.svelte";
  import InputInteger from "./InputInteger.svelte";

  // TS / UI
  import type { ColorConfig } from "../ts/ui/InputConfig";
  import { tiles_text, colorModes_text } from "../ts/ui/text";

  // TS / Logic
  import { Tiles, ColorModes } from "../ts/app/index";

  /* --- Component parameters --- */

  export let colorConfig: ColorConfig;

  /* --- Logic --- */

  const colors = [
    { value: "#3366ff", name: "Blu" },
    { value: "#66ff99", name: "Verde" },
    { value: "#ff6666", name: "Rosso" },
    { value: "#ffffff", name: "Bianco" },
    { value: "#000000", name: "Nero" },
  ];
</script>

<!-- Radio buttons to select the color mode -->
<InputItem>
  {#each ColorModes as cm}
    <label class="radio">
      <input type="radio" bind:group={colorConfig.mode} value={cm} />
      {colorModes_text[cm]}
    </label>
  {/each}
</InputItem>

<!-- If colormode is tile, we set color for each tile -->
{#if colorConfig.mode == "tile"}
  {#each Tiles as t}
    <InputItem>
      <label>{tiles_text[t]}</label>
      <select bind:value={colorConfig.tile[t]}>
        {#each colors as c}
          <option
            value={c.value}
            selected={c.value == colorConfig.tile[t] ? true : undefined}
            >{c.name}</option
          >
        {/each}
      </select>
    </InputItem>
  {/each}
  <!-- If colormode is distribution, for each color we specify its distribution -->
{:else if colorConfig.mode == "distribution"}
  {#each colors as color}
    <InputItem>
      <InputInteger
        label={color.name}
        bind:value={colorConfig.distribution[color.value]}
      />
    </InputItem>
  {/each}
{/if}

<style>
  .radio {
    display: flex;
    flex-flow: row nowrap;
  }
</style>
