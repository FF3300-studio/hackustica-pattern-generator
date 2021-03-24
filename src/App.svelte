<script lang="ts">
  /* --- Imports --- */
  import paper from "paper";

  // Svelts imports
  import InputGroup from "./components/InputGroup.svelte";
  import InputItem from "./components/InputItem.svelte";
  import InputInteger from "./components/InputInteger.svelte";
  import InputColor from "./components/InputColor.svelte";

  // TS / UI imports
  import type { InputConfig } from "./ts/ui/InputConfig";
  import { tiles_text } from "./ts/ui/text";

  // TS / Logic imports
  import { Tiles, Directions, ColorModes } from "./ts/app/index";

  /* --- Logic --- */

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
    color: {
      tiles: {
        mode: "tile",
        tile: {
          line: "#3366ff",
          wave: "#66ff99",
          peak: "#ff6666",
        },
        distribution: {
          "#3366ff": 0,
          "#66ff99": 0,
          "#ff6666": 0,
          "#ffffff": 1,
          "#000000": 0,
        },
      },
      background: {
        mode: "distribution",
        tile: {
          line: "#3366ff",
          wave: "#66ff99",
          peak: "#ff6666",
        },
        distribution: {
          "#3366ff": 0,
          "#66ff99": 0,
          "#ff6666": 0,
          "#ffffff": 1,
          "#000000": 0,
        },
      },
    },
    thicknesses: [0.1, 0.15, 0.2, 0.25, 0.3, 0.35],
  };
</script>

<main>
  <!--  -->

  <!-- Input -->
  <div class="input">
    <!-- Canvas -->
    <!-- <button on:click={handleDraw}>Disegna!</button> -->

    <!-- Canvas -->
    <InputGroup label={"Tavola disegno"}>
      <!--  -->
      <InputItem>
        <InputInteger label="Larghezza" bind:value={config.canvas.width} />
      </InputItem>
      <!--  -->
      <InputItem>
        <InputInteger label="Altezza" bind:value={config.canvas.height} />
      </InputItem>
      <!--  -->
    </InputGroup>

    <!-- Grid -->
    <InputGroup label={"Griglia"}>
      <!--  -->
      <InputItem>
        <InputInteger label="Righe" bind:value={config.grid.rows} />
      </InputItem>
      <!--  -->
      <InputItem>
        <InputInteger label="Colonne" bind:value={config.grid.columns} />
      </InputItem>
      <!--  -->
    </InputGroup>

    <!-- Densità -->
    <InputGroup label={"Densità forme"}>
      {#each Tiles as t}
        <InputItem>
          <InputInteger
            label={tiles_text[t]}
            bind:value={config.tiles[t].density}
          />
        </InputItem>
      {/each}
    </InputGroup>

    <!-- Colore tiles -->
    <InputGroup label={"Colore forme"}>
      <InputColor bind:colorConfig={config.color.tiles} />
    </InputGroup>

    <!-- Colore sfondo -->
    <InputGroup label={"Colore sfondo"}>
      <InputColor bind:colorConfig={config.color.background} />
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

  .input {
    max-width: 300px;
  }
</style>
