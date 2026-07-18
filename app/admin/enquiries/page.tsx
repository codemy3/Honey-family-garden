"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Enquiry } from "@/lib/validation";
import clsx from "clsx";

type StatusFilter = "all" | "new" | "contacted" | "booked" | "archived";

const statusColors: Record<string, string> = {
  new: "bg-gold/15 text-gold-dark",
  contacted: "bg-blue-100 text-blue-700",
  booked: "bg-success/10 text-success",
  archived: "bg-charcoal/10 text-charcoal/50",
};

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchEnquiries = useCallback(async () => {
    try {
      const res = await fetch("/api/enquiries");
      const data = await res.json();
      setEnquiries(data.enquiries || []);
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEnquiries();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchEnquiries]);

  const filteredEnquiries = enquiries.filter((e) => {
    if (filter === "all") return true;
    return e.status === filter;
  });

  const handleStatusChange = (id: string, newStatus: Enquiry["status"]) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
  };

  const statCounts = {
    total: enquiries.length,
    new: enquiries.filter((e) => e.status === "new").length,
    contacted: enquiries.filter((e) => e.status === "contacted").length,
    booked: enquiries.filter((e) => e.status === "booked").length,
  };

  return (
    <div className="pt-24 pb-16 bg-offwhite min-h-screen">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <nav className="text-sm text-charcoal/50 mb-2">
              <Link href="/" className="hover:text-gold transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-navy font-medium">Admin Enquiries</span>
            </nav>
            <h1 className="font-display font-bold text-3xl text-navy">
              Enquiry Management
            </h1>
          </div>
          <Link
            href="/admin/reviews"
            className="px-4 py-2 text-sm text-navy border border-lightgrey rounded-lg hover:bg-white transition-colors"
          >
            ← View Reviews
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-lightgrey">
            <p className="text-2xl font-bold text-navy">{statCounts.total}</p>
            <p className="text-xs text-charcoal/50">Total</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-lightgrey">
            <p className="text-2xl font-bold text-gold">{statCounts.new}</p>
            <p className="text-xs text-charcoal/50">New</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-lightgrey">
            <p className="text-2xl font-bold text-blue-600">{statCounts.contacted}</p>
            <p className="text-xs text-charcoal/50">Contacted</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-lightgrey">
            <p className="text-2xl font-bold text-success">{statCounts.booked}</p>
            <p className="text-xs text-charcoal/50">Booked</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-1 bg-white rounded-lg p-1 border border-lightgrey mb-6 w-fit">
          {(["all", "new", "contacted", "booked", "archived"] as StatusFilter[]).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 capitalize",
                  filter === f
                    ? "bg-navy text-cream"
                    : "text-charcoal/50 hover:bg-offwhite"
                )}
              >
                {f}
              </button>
            )
          )}
        </div>

        {/* Enquiry Cards */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-lightgrey">
            <p className="text-charcoal/40">
              {filter === "all"
                ? "No enquiries received yet"
                : `No ${filter} enquiries`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEnquiries.map((enquiry, index) => (
              <motion.div
                key={enquiry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="bg-white rounded-lg border border-lightgrey overflow-hidden"
              >
                {/* Summary Row */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-offwhite/50 transition-colors"
                  onClick={() =>
                    setExpandedId(expandedId === enquiry.id ? null : enquiry.id)
                  }
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="min-w-0">
                      <p className="font-medium text-navy text-sm truncate">
                        {enquiry.name}
                      </p>
                      <p className="text-charcoal/40 text-xs truncate">
                        {enquiry.email} · {enquiry.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-charcoal/40 text-xs hidden sm:block">
                      {enquiry.eventDate 
                        ? new Date(enquiry.eventDate).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Date TBD"}
                    </span>
                    <span className="text-charcoal/40 text-xs hidden sm:block">
                      {enquiry.guestCount} guests
                    </span>
                    <span
                      className={clsx(
                        "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                        statusColors[enquiry.status] || statusColors.new
                      )}
                    >
                      {enquiry.status}
                    </span>
                    <span className="text-charcoal/30 text-sm">
                      {expandedId === enquiry.id ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === enquiry.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-lightgrey/50 px-4 py-4 bg-offwhite/30"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-charcoal/50 font-semibold uppercase">Event Date</p>
                        <p className="text-sm text-navy">
                          {enquiry.eventDate 
                            ? new Date(enquiry.eventDate).toLocaleDateString("en-IN", {
                                weekday: "short",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "TBD"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-charcoal/50 font-semibold uppercase">Guests</p>
                        <p className="text-sm text-navy">{enquiry.guestCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-charcoal/50 font-semibold uppercase">Type</p>
                        <p className="text-sm text-navy capitalize">
                          {enquiry.eventType || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-charcoal/50 font-semibold uppercase">Received</p>
                        <p className="text-sm text-navy">
                          {new Date(enquiry.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {enquiry.message && (
                      <div className="mb-4">
                        <p className="text-xs text-charcoal/50 font-semibold uppercase mb-1">
                          Message
                        </p>
                        <p className="text-sm text-charcoal/80 bg-white p-3 rounded-md border border-lightgrey/50">
                          {enquiry.message}
                        </p>
                      </div>
                    )}

                    {/* Status Actions */}
                    <div className="flex flex-wrap gap-2">
                      <p className="text-xs text-charcoal/50 font-semibold uppercase self-center mr-2">
                        Set Status:
                      </p>
                      {(["new", "contacted", "booked", "archived"] as const).map(
                        (status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(enquiry.id, status)}
                            className={clsx(
                              "px-3 py-1 rounded text-xs font-medium capitalize transition-colors",
                              enquiry.status === status
                                ? "bg-navy text-cream"
                                : "bg-offwhite border border-lightgrey hover:bg-lightgrey text-charcoal/60"
                            )}
                          >
                            {status}
                          </button>
                        )
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
