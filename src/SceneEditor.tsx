import React, { useState } from 'react';
import { useQuery } from '@apollo/client'
import { gql } from 'apollo-boost';

const GET_CHARACTERS = gql`
  query Characters {
    characters {
      results {
        id
        name
      }
    }
  }
`;

const GET_LOCATIONS = gql`
  query Locations {
    locations {
      results {
        id
        name
      }
    }
  }
`;

interface Character {
  id: string;
  name: string;
}

interface Location {
  id: string;
  name: string;
}

interface Scene {
  id: string;
  characters: Character[];
  location: Location;
  description: string;
}

const SceneEditor: React.FC = () => {
  const { loading: characterLoading, error: characterError, data: characterData } = useQuery(GET_CHARACTERS);
  const { loading: locationLoading, error: locationError, data: locationData } = useQuery(GET_LOCATIONS);
  const [scenes, setScenes] = useState<Scene[]>([]);

  if (characterLoading || locationLoading) return <p>Loading...</p>;
  if (characterError) return <p>Error: {characterError.message}</p>;
  if (locationError) return <p>Error: {locationError.message}</p>;

  const addScene = () => {
    const newScene: Scene = {
      id: scenes.length.toString(),
      characters: [],
      location: locationData.locations.results[0],
      description: ''
    };
    setScenes([...scenes, newScene]);
  };

  const removeScene = (sceneId: string) => {
    const updatedScenes = scenes.filter(scene => scene.id !== sceneId);
    setScenes(updatedScenes);
  };

  const addCharacterToScene = (sceneId: string, character: Character) => {
    const updatedScenes = scenes.map(scene => {
      if (scene.id === sceneId) {
        const updatedCharacters = [...scene.characters, character];
        return { ...scene, characters: updatedCharacters };
      }
      return scene;
    });
    setScenes(updatedScenes);
  };

  const removeCharacterFromScene = (sceneId: string, characterId: string) => {
    const updatedScenes = scenes.map(scene => {
      if (scene.id === sceneId) {
        const updatedCharacters = scene.characters.filter(character => character.id !== characterId);
        return { ...scene, characters: updatedCharacters };
      }
      return scene;
    });
    setScenes(updatedScenes);
  };

  const setSceneLocation = (sceneId: string, location: Location) => {
    const updatedScenes = scenes.map(scene => {
      if (scene.id === sceneId) {
        return { ...scene, location };
      }
      return scene;
    });
    setScenes(updatedScenes);
  };

  const setSceneDescription = (sceneId: string, description: string) => {
    const updatedScenes = scenes.map(scene => {
      if (scene.id === sceneId) {
        return { ...scene, description };
      }
      return scene;
    });
    setScenes(updatedScenes);
  };

  return (
    <div>
      <h2>Scene Editor</h2>
      <button onClick={addScene}>Add Scene</button>
      {scenes.map(scene => (
        <div key={scene.id}>
          <h3>Scene {scene.id}</h3>
          <div>
            <h4>Characters</h4>
            <ul>
              {characterData.characters.results.map((character: Character) => (
                <li key={character.id}>
                  {character.name}
                  <button onClick={() => addCharacterToScene(scene.id, character)}>Add</button>
                </li>
              ))}
            </ul>
            <ul>
              {scene.characters.map(character => (
                <li key={character.id}>
                  {character.name}
                  <button onClick={() => removeCharacterFromScene(scene.id, character.id)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Location</h4>
            <select
              value={scene.location.id}
              onChange={(e) => {
                const selectedLocation = locationData.locations.results.find((location: Location) => location.id === e.target.value);
                if (selectedLocation) {
                  setSceneLocation(scene.id, selectedLocation);
                }
              }}
            >
              {locationData.locations.results.map((location: Location) => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </select>
          </div>
          <div>
            <h4>Description</h4>
            <input
              type="text"
              value={scene.description}
              onChange={(e) => setSceneDescription(scene.id, e.target.value)}
            />
          </div>
          <button onClick={() => removeScene(scene.id)}>Remove Scene</button>
        </div>
      ))}
    </div>
  );
};

export default SceneEditor;