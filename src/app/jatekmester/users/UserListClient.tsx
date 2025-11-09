"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Eye, Pencil, Trash2, X, Save, Ban, EyeOff } from "lucide-react";

type Game = {
  id: string;
  name: string;
  environment: {
    id: string;
    name: string;
  };
  _count: {
    playerCards: number;
    battles: number;
  };
};

type User = {
  id: string;
  email: string;
  username: string;
  role: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  games: Game[];
  _count: {
    games: number;
    sessions: number;
  };
};

type Props = {
  initialUsers: User[];
  currentUserId: string;
};

export function UserListClient({ initialUsers, currentUserId }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    role: "",
    emailVerified: false,
    twoFactorEnabled: false,
    password: "",
  });

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsEditing(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      password: "",
    });
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    // Validáció
    if (editForm.password && editForm.password.length > 0 && editForm.password.length < 6) {
      alert("A jelszónak legalább 6 karakter hosszúnak kell lennie!");
      return;
    }

    if (!editForm.username || editForm.username.trim().length === 0) {
      alert("A felhasználónév nem lehet üres!");
      return;
    }

    if (!editForm.email || !editForm.email.includes("@")) {
      alert("Kérlek adj meg egy érvényes email címet!");
      return;
    }

    // Megerősítés, ha jelszót változtatunk
    if (editForm.password && editForm.password.length > 0) {
      const confirmed = confirm(
        `Biztosan megváltoztatod ${selectedUser.username} jelszavát?\n\n` +
          `A felhasználó azonnal az új jelszóval tud majd belépni.`
      );
      if (!confirmed) return;
    }

    try {
      const res = await fetch(`/api/jatekmester/users?id=${selectedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Hiba történt");
      }

      alert("Felhasználó sikeresen frissítve!");
      router.refresh();
      setSelectedUser(null);
      setIsEditing(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Hiba történt a mentés során!");
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (user.id === currentUserId) {
      alert("Nem törölheted saját magadat!");
      return;
    }

    const confirmed = confirm(
      `Biztosan törölni szeretnéd ${user.username} felhasználót?\n\n` +
        `Ez törli az összes játékát (${user._count.games} db) és minden hozzá kapcsolódó adatot!\n\n` +
        `Ez a művelet NEM VISSZAVONHATÓ!`
    );

    if (!confirmed) return;

    // Dupla megerősítés kritikus művelethez
    const doubleConfirm = confirm(
      `UTOLSÓ FIGYELMEZTETÉS!\n\n` +
        `Tényleg véglegesen törölni akarod ${user.username} felhasználót?\n\n` +
        `Írj be "TÖRLÉS"-t a megerősítéshez.`
    );

    if (doubleConfirm) {
      const finalConfirm = prompt(`Írd be: TÖRLÉS`);
      if (finalConfirm !== "TÖRLÉS") {
        alert("Törlés megszakítva.");
        return;
      }
    } else {
      return;
    }

    try {
      const res = await fetch(`/api/jatekmester/users?id=${user.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Hiba történt");
      }

      alert("Felhasználó sikeresen törölve!");
      setUsers(users.filter((u) => u.id !== user.id));
      setSelectedUser(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Hiba történt a törlés során!");
    }
  };

  const handleSuspendUser = async (user: User) => {
    const confirmed = confirm(
      `Felfüggeszted ${user.username} fiókját?\n\n` +
        `A felhasználó nem fog tudni bejelentkezni, amíg vissza nem állítod.`
    );

    if (!confirmed) return;

    // Implementálhatjuk később az "isSuspended" mezővel a schemában
    alert("A felfüggesztés funkció hamarosan elérhető lesz!");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Users List */}
      <div className="space-y-4">
        {users.map((user) => {
          const isCurrentUser = user.id === currentUserId;
          
          return (
            <Card
              key={user.id}
              className={`border-2 ${
                isCurrentUser
                  ? "border-green-400/30 bg-green-900/10"
                  : "border-zinc-700 bg-zinc-900/50"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-zinc-100 flex items-center gap-2">
                      {user.username}
                      {isCurrentUser && (
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                          TE
                        </span>
                      )}
                      {user.role === "JATEKMESTER" && (
                        <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                          🛡️ ADMIN
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-zinc-400 mt-1">{user.email}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-zinc-800/50 p-2 rounded text-center">
                    <p className="text-zinc-400">Játékok</p>
                    <p className="text-lg font-bold text-blue-200">{user._count.games}</p>
                  </div>
                  <div className="bg-zinc-800/50 p-2 rounded text-center">
                    <p className="text-zinc-400">2FA</p>
                    <p className="text-lg">
                      {user.twoFactorEnabled ? "✅" : "❌"}
                    </p>
                  </div>
                  <div className="bg-zinc-800/50 p-2 rounded text-center">
                    <p className="text-zinc-400">Verify</p>
                    <p className="text-lg">
                      {user.emailVerified ? "✅" : "⚠️"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewUser(user)}
                    className="flex-1 border-blue-400/40 text-blue-200"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Részletek
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditUser(user)}
                    className="border-amber-400/40 text-amber-200"
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  {!isCurrentUser && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSuspendUser(user)}
                        className="border-orange-400/40 text-orange-200"
                      >
                        <Ban className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(user)}
                        className="border-red-400/40 text-red-200"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>

                <p className="text-xs text-zinc-500 text-center">
                  Regisztráció: {new Date(user.createdAt).toLocaleDateString("hu-HU")}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* User Details / Edit Panel */}
      <div className="lg:sticky lg:top-8 lg:self-start">
        {selectedUser ? (
          <Card className="border-2 border-purple-400/30 bg-zinc-900/70">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-purple-200">
                  {isEditing ? "Szerkesztés" : "Részletek"}
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSelectedUser(null);
                    setIsEditing(false);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  {/* Edit Form */}
                  <Field>
                    <FieldLabel className="text-zinc-200">Felhasználónév</FieldLabel>
                    <Input
                      value={editForm.username}
                      onChange={(e) =>
                        setEditForm({ ...editForm, username: e.target.value })
                      }
                      className="bg-zinc-800 border-zinc-700 text-zinc-100"
                    />
                  </Field>

                  <Field>
                    <FieldLabel className="text-zinc-200">Email</FieldLabel>
                    <Input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="bg-zinc-800 border-zinc-700 text-zinc-100"
                    />
                  </Field>

                  <Field>
                    <FieldLabel className="text-zinc-200">Szerepkör</FieldLabel>
                    <select
                      value={editForm.role}
                      onChange={(e) =>
                        setEditForm({ ...editForm, role: e.target.value })
                      }
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100"
                      disabled={selectedUser.id === currentUserId}
                    >
                      <option value="PLAYER">🎮 Játékos</option>
                      <option value="JATEKMESTER">🛡️ Játékmester</option>
                    </select>
                    {selectedUser.id === currentUserId && (
                      <p className="text-xs text-amber-400 mt-1">
                        Saját szerepkört nem módosíthatod!
                      </p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel className="text-zinc-200">
                      Új jelszó (opcionális)
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={editForm.password}
                        onChange={(e) =>
                          setEditForm({ ...editForm, password: e.target.value })
                        }
                        placeholder="Min. 6 karakter, hagyd üresen, ha nem változtatsz"
                        className="bg-zinc-800 border-zinc-700 text-zinc-100 pr-10"
                        minLength={6}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-zinc-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-zinc-400" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      ⚠️ Ha új jelszót adsz meg, a felhasználó azonnal új jelszóval tud belépni.
                    </p>
                  </Field>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-zinc-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.emailVerified}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            emailVerified: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Email megerősítve</span>
                    </label>

                    <label className="flex items-center gap-2 text-zinc-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.twoFactorEnabled}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            twoFactorEnabled: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">2FA engedélyezve</span>
                    </label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleSaveEdit}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Mentés
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 border-zinc-600"
                    >
                      Mégse
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* View Mode */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-zinc-400">Felhasználónév</p>
                      <p className="text-zinc-100 font-semibold">
                        {selectedUser.username}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Email</p>
                      <p className="text-zinc-100 font-semibold">
                        {selectedUser.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Szerepkör</p>
                      <p className="text-zinc-100 font-semibold">
                        {selectedUser.role === "JATEKMESTER"
                          ? "🛡️ Játékmester"
                          : "🎮 Játékos"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-zinc-400">Email megerősítve</p>
                        <p className="text-lg">
                          {selectedUser.emailVerified ? "✅ Igen" : "⚠️ Nem"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">2FA</p>
                        <p className="text-lg">
                          {selectedUser.twoFactorEnabled ? "✅ Igen" : "❌ Nem"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Regisztráció</p>
                      <p className="text-zinc-100">
                        {new Date(selectedUser.createdAt).toLocaleString("hu-HU")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Utolsó módosítás</p>
                      <p className="text-zinc-100">
                        {new Date(selectedUser.updatedAt).toLocaleString("hu-HU")}
                      </p>
                    </div>
                  </div>

                  {/* User Games */}
                  {selectedUser.games.length > 0 && (
                    <div className="pt-4 border-t border-zinc-700">
                      <h3 className="text-sm font-semibold text-zinc-200 mb-3">
                        Játékok ({selectedUser.games.length})
                      </h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {selectedUser.games.map((game) => (
                          <div
                            key={game.id}
                            className="bg-zinc-800/50 p-3 rounded-lg"
                          >
                            <p className="text-sm font-semibold text-zinc-100">
                              {game.name}
                            </p>
                            <p className="text-xs text-zinc-400">
                              🌍 {game.environment.name}
                            </p>
                            <div className="flex gap-3 mt-2 text-xs">
                              <span className="text-blue-300">
                                🎴 {game._count.playerCards} kártya
                              </span>
                              <span className="text-green-300">
                                ⚔️ {game._count.battles} harc
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => handleEditUser(selectedUser)}
                    className="w-full bg-amber-600 hover:bg-amber-700 mt-4"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Szerkesztés
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-dashed border-zinc-700 bg-zinc-900/30">
            <CardContent className="flex items-center justify-center py-16">
              <p className="text-zinc-500">
                Válassz ki egy felhasználót a részletek megtekintéséhez
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
