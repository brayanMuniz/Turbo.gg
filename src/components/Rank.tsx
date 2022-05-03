import React, { useState } from "react";
import axios from "axios";
import { apikey } from "../apikey";

interface SummonerMetaData {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

interface IProps {
  name: string;
}

const Summoner: React.FC<IProps> = (name) => {
  const platformRoute: string = "https://na1.api.riotgames.com";
  const regionRoute: string = "https://americas.api.riotgames.com";
  const [summonerInfo, setSummonerInfo] = useState<SummonerMetaData>();
  const [summonerName, setSummonerName] = useState<string>();
  const [recentSummoners, setRecentSummoners] = useState<string[]>();
  const getSummonerData = async () => {
    await axios
      .get(
        platformRoute + `/lol/summoner/v4/summoners/by-name/${summonerName}`,
        {
          params: {
            api_key: apikey,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setSummonerInfo(response.data);
        matchesPlayed(response.data.puuid);
      });
  };
  const matchesPlayed = async (puuid: string) => {
    console.log(puuid);
    await axios
      .get(regionRoute + `/lol/match/v5/matches/by-puuid/${puuid}/ids`, {
        params: {
          api_key: apikey,
        },
      })
      .then((response) => {
        console.log(response.data);
        recentMatch(response.data[0]);
      });
  };
  const recentMatch = (matchId: string) => {
    console.log(matchId);
    axios
      .get(regionRoute + `/lol/match/v5/matches/${matchId}`, {
        params: {
          api_key: apikey,
        },
      })
      .then((response) => {
        console.log(response.data);
        recentPlayers(response.data);
      });
  };
  const recentPlayers = (matchMetaData: any) => {
    let summoners: Array<string> = matchMetaData.metadata.participants;
    let playerNames: Array<string> = [];
    summoners.forEach(async (player: string, index) => {
      await axios
        .get(platformRoute + `/lol/summoner/v4/summoners/by-puuid/${player}`, {
          params: {
            api_key: apikey,
          },
        })
        .then((response) => {
          playerNames.push(response.data.name);
        });

      if (summoners.length - 1 === index) {
        setRecentSummoners(playerNames);
      }
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSummonerName(e.target.value);
  };
  return (
    <div>
      <button onClick={getSummonerData}>Click for Summoner Info </button>
      <input
        type="text"
        placeholder="TastyMango69"
        value={summonerName}
        onChange={handleChange}
      />
      <div>
        {summonerName} is level {summonerInfo?.summonerLevel}
        <div>Recent Players</div>
        {recentSummoners?.map((player) => {
          return <li>{player}</li>;
        })}
      </div>
    </div>
  );
};

export default Summoner;
