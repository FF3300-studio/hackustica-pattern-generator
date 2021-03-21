<script lang="ts">
  import { draw } from "./ts/draw";
  import type { ColorMode, Tile, InputConfig } from "./ts/InputConfig";
  /*
   * In svelte, because of Rollup,
   * when you have to import a Type/Interface
   * you need to add "type" before the import
   */

  import InputGroup from "./components/InputGroup.svelte";
  import InputItem from "./components/InputItem.svelte";
  import InputInteger from "./components/InputInteger.svelte";
  import InputColor from "./components/InputColor.svelte";

  const tiles: Array<{ id: Tile; name: string }> = [
    { id: "line", name: "Linea" },
    { id: "wave", name: "Onda" },
    { id: "peak", name: "Picco" },
  ];

  const color_modes: Array<{ id: ColorMode; name: string }> = [
    { id: "tile", name: "Un colore per forma" },
    {
      id: "distribution",
      name: "Distribuzione di colore indipendente dalla forma",
    },
  ];

  let config: InputConfig = {
    canvas: {
      width: 500,
      height: 700,
    },
    grid: {
      rows: 10,
      columns: 10,
      cell_ratio: 0.75,
      cell_spacing: {
        x: 0,
        y: 0,
      },
    },
    tiles: {
      line: { density: 1 },
      wave: { density: 1, squaring: 0.5, direction: "random" },
      peak: { density: 1, squaring: 0.65, direction: "random" },
    },
    colors: {
      rosso: "#ff6666",
      verde: "#66ff99",
      blu: "#3366ff",
      nero: "#000000",
      bianco: "#ffffff",
    },
    color: {
      tiles: {
        mode: "tile",
        tile_config: {
          line: "blue",
          wave: "green",
          peak: "red",
        },
        distribution_config: {
          red: 1,
          green: 1,
          blue: 1,
          black: 0,
          white: 0,
        },
      },
      background: {
        mode: "distribution",
        tile_config: {
          line: "blue",
          wave: "green",
          peak: "red",
        },
        distribution_config: {
          red: 0,
          green: 0,
          blue: 0,
          black: 0,
          white: 1,
        },
      },
    },
    thicknesses: [0.1, 0.15, 0.2, 0.25, 0.3, 0.35],
  };

  function handleDraw() {
    console.log("ciccio");
    // draw(config);
  }
</script>

<main>
  <!--  -->

  <!-- Input -->
  <div class="input">
    <!-- Canvas -->
    <button on:click={handleDraw}>Disegna!</button>

    <!-- Canvas -->
    <InputGroup label={"Tavola disegno"}>
      <!--  -->
      <InputItem>
        <label for="canvas_width">Larghezza</label>
        <InputInteger id="canvas_width" bind:value={config.canvas.width} />
      </InputItem>
      <!--  -->
      <InputItem>
        <label for="canvas_height">Altezza</label>
        <InputInteger id="canvas_height" bind:value={config.canvas.height} />
      </InputItem>
    </InputGroup>

    <!-- Grid -->
    <InputGroup label={"Griglia"}>
      <!--  -->
      <InputItem>
        <label for="grid_rows">Righe</label>
        <InputInteger id="grid_rows" bind:value={config.grid.rows} />
      </InputItem>
      <!--  -->
      <InputItem>
        <label for="grid_columns">Colonne</label>
        <InputInteger id="grid_columns" bind:value={config.grid.columns} />
      </InputItem>
    </InputGroup>

    <!-- Densità -->
    <InputGroup label={"Densità forme"}>
      {#each tiles as tile}
        <InputItem>
          <label for="{tile.id}_density">{tile.name}</label>
          <InputInteger
            id="{tile.id}_density"
            bind:value={config.tiles[tile.id].density}
          />
        </InputItem>
      {/each}
    </InputGroup>

    <!-- Colore tiles -->
    <InputGroup label={"Colore forme"}>
      <!-- <InputColor
    {color_modes}
    {tiles}
    {colors}
    bind:color_mode={config.color.tiles.mode}
    bind:tile_config={config.color.tiles.tile_config}
    bind:distribution_config={config.color.tiles.distribution_config}
  /> -->
    </InputGroup>

    <!-- Colore sfondo -->
    <InputGroup label={"Colore sfondo"}>
      <!-- <InputColor
    {color_modes}
    {tiles}
    colors={config.colors}
    bind:color_mode={config.color.background.mode}
    bind:tile_config={config.color.background.tile_config}
    bind:distribution_config={config.color.background.distribution_config}
  /> -->
    </InputGroup>
  </div>

  <!-- Output -->
  <div class="output">
    <pre>
      {JSON.stringify(config, null, 4)}
    </pre>
  </div>

  <!--  -->
</main>

<style>
  main {
    display: flex;
    flex-flow: row nowrap;
  }
</style>
