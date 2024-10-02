"use client";
import { useEffect, useState } from "react";

import supabase from "@/supabaseClient";
import PropTypes from "prop-types";
import FeedbackCard from "./FeedbackCard";
import tailwindStyles from "../index.css?inline";

Widget.propTypes = {
  projectId: PropTypes.number,
};

function Widget({ projectId = 1 }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isSameDomain, setIsSameDomain] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const { data, error } = await supabase
        .from("Feedback")
        .select("*")
        .eq("projectId", projectId)
        .eq("isFavorite", true);
      if (error) {
        console.error("Error fetching feedbacks", error);
      } else {
        if (data?.length > 0) {
          setFeedbacks([...data]);
        }
      }
    };

    if (projectId) {
      fetchFeedbacks();
    }
  }, [projectId]);

  // Fetch the project details from Supabase
  useEffect(() => {
    const fetchProjectDetails = async () => {
      const { data, error } = await supabase
        .from("Project")
        .select("*")
        .eq("id", projectId)
        .single(); // Use single() to fetch a single project

      if (error) {
        console.error("Error fetching project details:", error);
      } else {
        if (data?.url) {
          compareDomains(data.url, window.location.href);
        }
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const compareDomains = (projectUrl) => {
    try {
      const currentUrl = window.top.location.href;
      const projectUrlObj = new URL(projectUrl);
      const currentUrlObj = new URL(currentUrl);
      if (projectUrlObj.origin === currentUrlObj.origin) {
        setIsSameDomain(true);
      } else {
        setIsSameDomain(false);
        console.error("Domains did not match");
      }
    } catch (error) {
      console.error("Error comparing domains:", error);
      setIsSameDomain(false);
    }
  };

  if (!isSameDomain) {
    return null;
  }

  return (
    <>
      <style>{tailwindStyles}</style>
      <div className="widget columns-1 md:columns-3 lg:columns-4  space-y-4">
        {feedbacks?.map((feedback) => (
          <div key={feedback?.id} className="break-inside-avoid">
            <FeedbackCard item={feedback} />
          </div>
        ))}
      </div>
    </>
  );
}

export default Widget;
