<script lang="ts">
  import InputItem from "./InputItem.svelte";
  import InputInteger from "./InputInteger.svelte";

  export let color_mode: string;
  export let color_modes: Array<{ id: string; name: string }>;

  export let tiles: Array<{ id: string; name: string }>;
  export let colors: Array<{ id: string; value: string; name: string }>;

  export let tile_config: Record<string, string>;
  export let distribution_config: Record<string, number>;
</script>

<!-- Radio buttons to select the color mode -->
<InputItem>
  {#each color_modes as item}
    <label>
      <input type="radio" bind:group={color_mode} value={item.id} />
      {item.name}
    </label>
  {/each}
</InputItem>

<!-- If colormode is tile, we select a color for each tile -->
{#if color_mode == "tile"}
  {#each tiles as tile}
    <InputItem>
      <label>{tile.name}</label>
      <select bind:value={tile_config[tile.id]}>
        {#each colors as color}
          <option
            value={color.id}
            selected={color.id == tile_config[tile.id] ? true : undefined}
            >{color.name}</option
          >
        {/each}
      </select>
    </InputItem>
  {/each}
  <!-- If colormode is distribution, for each color we specify its distribution -->
{:else if color_mode == "distribution"}
  {#each colors as color}
    <InputItem>
      <label>{color.name}</label>
      <InputInteger
        id={"bg-" + color.value}
        bind:value={distribution_config[color.id]}
      />
    </InputItem>
  {/each}
{/if}
